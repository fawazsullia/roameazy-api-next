import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Company, CompanyDetail, User } from "../orm/entities";
import { getConnection, MongoRepository } from "typeorm";
import { LoginRequest, OnboardUserRequest } from "../models";
import { StringUtil } from "../utils/string.util";
import { UploadUtils } from "../utils/upload.util";

const bcrypt = require('bcrypt');
import crypto from 'crypto';
import { CreateSuperAdminRequest } from "../models/user/create-super-admin.request.model";
import { UserType } from "../enums";
import { ObjectId } from "mongodb";
import { v4 as uuidV4 } from "uuid"

@Service()
export class UserService {

  @InjectRepository(User)
  private userModel: MongoRepository<User>;

  @InjectRepository(Company)
  private companyModel: MongoRepository<Company>;

  @InjectRepository(CompanyDetail)
  private companyDetailModel: MongoRepository<CompanyDetail>;

  // this is to create an admin user
  async create(params: OnboardUserRequest, license: Express.Multer.File, logo?: Express.Multer.File) {
    const { name, email, companyName, companyEmail, companyAddress, companyPhone, companyDescription } = params;
    const user = await this.userModel.findOne({ where: { email } });

    const existingCompany = await this.companyModel.findOne({ where: { company: companyEmail } });

    if (existingCompany) {
      throw new Error('Company already exists');
    }

    if (user) {
      throw new Error('User already exists');
    }

    var password = crypto.randomBytes(10).toString('hex');

    // need to send password after user creation

    try {
      const fileName = StringUtil.getUploadFileName(license.originalname, companyName);
      const uploadedUrl = await UploadUtils.uploadFileToBucket(license, 'licenses', fileName);
      let uploadedLogoUrl = '';
      if(logo) {
        const logoFileName = StringUtil.getUploadFileName(logo.originalname, companyName);
        const logoUrl = await UploadUtils.uploadFileToBucket(logo, 'logos', logoFileName);
        uploadedLogoUrl = logoUrl;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newuser = new User();
      const company = new Company();
      company.name = companyName;
      company.createdAt = new Date();
      company.updatedAt = new Date();
      company.isVerified = true;
      company.plan = 'free';
      company.token = uuidV4();
      const createdCompany = await this.companyModel.save(company);


      const companyDetail = new CompanyDetail();
      companyDetail.address = companyAddress;
      companyDetail.email = companyEmail;
      companyDetail.phone = companyPhone;
      companyDetail.createdAt = new Date();
      companyDetail.updatedAt = new Date();
      companyDetail.companyId = createdCompany._id.toString();
      companyDetail.tradeLicense = uploadedUrl;
      companyDetail.description = companyDescription;
      if(uploadedLogoUrl) {
        companyDetail.logo = uploadedLogoUrl;
      }
      await this.companyDetailModel.save(companyDetail);

      newuser.companyId = createdCompany._id;
      newuser.name = name;
      newuser.email = email;
      newuser.password = hashedPassword;
      newuser.role = UserType.ADMIN;
      newuser.createdAt = new Date();
      newuser.updatedAt = new Date();
      await this.userModel.save(newuser);
      return password;
    } catch (error) {
      throw error;
    } finally {
    }
  }

  async createSuperAdmin(params: CreateSuperAdminRequest) {
    const { username, email, password, confirmPassword, role } = params;
    const existing = await this.userModel.findOne({ where: { $or: [{ username }, { email }] } });
    if (existing) {
      throw new Error('User already exists');
    }
    if (password !== confirmPassword) {
      throw new Error('Password does not match');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const company = await this.companyModel.findOne({
      where: {
        isRoamEazy: true
      }
    });
    if (!company) {
      throw new Error('RoamEazy company not found');
    }
    const superAdminUser = new User();
    superAdminUser.name = username;
    superAdminUser.email = email;
    superAdminUser.password = hashedPassword;
    superAdminUser.role = role;
    superAdminUser.companyId = company._id;
    superAdminUser.createdAt = new Date();
    superAdminUser.updatedAt = new Date();
    await this.userModel.save(superAdminUser);
  }

  async login(params: LoginRequest): Promise<any> {
    const { email, password } = params;
    const user = await this.userModel.findOne({
      where: {
        email
      }
    })
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    return user;
  }

  public async getUserById(id: string): Promise<User> {
    const user = await this.userModel.findOne({
      where: {
        _id: new ObjectId(id)
      }
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  public async verifyAuth(userId: string) {
    const user = await this.userModel.findOne({
      where: {
        _id: new ObjectId(userId)
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    const company = await this.companyModel.findOne({
      where: {
        _id: new ObjectId(user.companyId)
      }
    });
    if (!company) {
      throw new Error('Company not found');
    }
    return {
      ...user,
      companyId: user.companyId.toString(),
      company
    }
  }
}