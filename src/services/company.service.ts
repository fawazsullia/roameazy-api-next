import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Company, CompanyDetail } from "../orm/entities";
import { MongoRepository } from "typeorm";
import { ObjectId } from "mongodb";

@Service()
export class CompanyService {

    @InjectRepository(Company)
    private companyRepository: MongoRepository<Company>;

    @InjectRepository(CompanyDetail)
    private companyDetailRepository: MongoRepository<CompanyDetail>;

    public async getCompanyById(id: string) {
        // fetch company by id
        const company = await this.companyRepository.findOne({
            where: {
                _id: new ObjectId(id)
            }
        });
        if (!company) {
            throw new Error('Company not found');
        }
        const companyDetails = await this.companyDetailRepository.findOne({
            where: {
                companyId: id
            }
        });
        return {
            ...company,
            details: companyDetails
        }
    }

    public async getCompanies(getDetail?: boolean, limit?: number, offset?: number) {
        // fetch all companies except roameazy
        const query: any = {
            where: {
                $or: [{ isRoamEazy: { $exists: false } }, { isRoamEazy: false }]
            }
        };
        if (limit) {
            query.take = limit;
        }
        if (offset) {
            query.skip = offset;
        }
        const companies = await this.companyRepository.find(query);
        if (!getDetail) {
            return companies;
        }
        const totalCompanies = await this.companyRepository.count();
        const companyIds = companies.map(company => company._id.toString());
        const companyDetails = await this.companyDetailRepository.find({
            where: {
                companyId: {
                    $in: companyIds
                }
            }
        });
        const companiesArr = companies.map(company => {
            const details = companyDetails.find(detail => detail.companyId === company
                ._id.toString());
            return {

                ...company,
                details
            }
        }
        );
        return {
            companies: companiesArr,
            total: totalCompanies
        }
    }

    public async getCompanyByToken(token: string) {
        // fetch company by token
        const company = await this.companyRepository.findOne({
            where: {
                token
            }
        });
        if (!company) {
            throw new Error('Company not found');
        }
        const companyDetails = await this.companyDetailRepository.findOne({
            where: {
                companyId: company._id.toString()
            }
        });
        return {
            id: company._id.toString(),
            ...company,
            details: companyDetails
        }
    }
}