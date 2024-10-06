import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { FormSubmission } from "../orm/entities";
import { MongoRepository } from "typeorm";

@Service()
export class FormSubmissionService {

    @InjectRepository(FormSubmission)
    private formSubmissionModel: MongoRepository<FormSubmission>;
    
    public async joinUsAsTravelAgency( email: string, companyName: string, contactNumber: string, page?: string ) {
        const formSubmission = new FormSubmission();
        formSubmission.context = 'join-us-as-travel-agency-home';
        formSubmission.data = { email, companyName, contactNumber, page };
        formSubmission.createdAt = new Date();
        formSubmission.updatedAt = new Date();
        return this.formSubmissionModel.save(formSubmission);
    }
}