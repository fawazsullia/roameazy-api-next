import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Company, CompanyDetail, SuperAdminUser, User } from "../orm/entities";
import { getConnection, MongoRepository } from "typeorm";
import { LoginRequest, OnboardUserRequest } from "../models";
import { StringUtil } from "../utils/string.util";
import { UploadUtils } from "../utils/upload.util";

const bcrypt = require('bcrypt');
import crypto from 'crypto';
import { CreateSuperAdminRequest } from "../models/user/create-super-admin.request.model";

@Service()
export class UserService {

  @InjectRepository(User)
  private userModel: MongoRepository<User>;

  @InjectRepository(Company)
  private companyModel: MongoRepository<Company>;

  @InjectRepository(CompanyDetail)
  private companyDetailModel: MongoRepository<CompanyDetail>;

  @InjectRepository(SuperAdminUser)
  private readonly superAdminUserModel: MongoRepository<SuperAdminUser>;



  // this is to create an admin user
  async create(params: OnboardUserRequest, license: Express.Multer.File) {
    const { name, email, companyName, companyEmail, companyAddress, companyPhone, companyDescription } = params;
    console.log('params', license);
    const user = await this.userModel.findOne({ where: { email } });

    const existingCompany = await this.companyModel.findOne({ where: { name: companyEmail } });

    if (existingCompany) {
      throw new Error('Company already exists');
    }

    if (user) {
      throw new Error('User already exists');
    }

    var password = crypto.randomBytes(10).toString('hex');

    console.log('password', password);

    try {
      const fileName = StringUtil.getUploadFileName(license.originalname, companyName);
      const uploadedUrl = await UploadUtils.uploadFileToBucket(license, 'licenses', fileName);

      const hashedPassword = await bcrypt.hash(password, 10);
      const newuser = new User();
      const company = new Company();
      company.name = companyName;
      company.createdAt = new Date();
      company.updatedAt = new Date();
      company.isVerified = true;
      company.plan = 'free';
      const createdCompany = await this.companyModel.create(company);

      const companyDetail = new CompanyDetail();
      companyDetail.address = companyAddress;
      companyDetail.email = companyEmail;
      companyDetail.phone = companyPhone;
      companyDetail.createdAt = new Date();
      companyDetail.updatedAt = new Date();
      companyDetail.companyId = createdCompany._id;
      companyDetail.tradeLicense = uploadedUrl;
      companyDetail.description = companyDescription;
      await this.companyDetailModel.create(companyDetail);

      newuser.companyId = createdCompany._id;
      newuser.name = name;
      newuser.email = email;
      newuser.password = hashedPassword;
      newuser.role = 'admin';
      newuser.createdAt = new Date();
      newuser.updatedAt = new Date();
      await this.userModel.create(newuser);
    } catch (error) {
      throw error;
    } finally {
    }
  }

  async createSuperAdmin(params: CreateSuperAdminRequest) {
    const { username, email, password, confirmPassword, role } = params;
    const existing = await this.superAdminUserModel.findOne({ where: { $or: [{ username }, { email }] } });
    if (existing) {
      throw new Error('User already exists');
    }
    if (password !== confirmPassword) {
      throw new Error('Password does not match');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const superAdminUser = new SuperAdminUser();
    superAdminUser.name = username;
    superAdminUser.email = email;
    superAdminUser.password = hashedPassword;
    superAdminUser.role = role;
    superAdminUser.createdAt = new Date();
    superAdminUser.updatedAt = new Date();
    await this.superAdminUserModel.create(superAdminUser);
  }

  async login(params: LoginRequest): Promise<any> {
    const { email, password, isSuperAdminLogin } = params;
    if (isSuperAdminLogin) {
      const user = await this.superAdminUserModel.findOne({
        where: {
          email
        }
      });
      if (!user) {
        throw new Error('Invalid credentials');
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }
      return user;
    }
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
}