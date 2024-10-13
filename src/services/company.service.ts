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
    if(!company) {
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
}