import { BodyParam, JsonController, Post } from "routing-controllers";
import { Inject } from "typedi";
import { FormSubmissionService } from "../services/form-submission.service";

@JsonController("/form-submission")
export class FormSubmissionController {

    @Inject()
    private formSubmissionService: FormSubmissionService;

    @Post('/join-us-as-travel-agency')
    public async joinUsAsTravelAgency(
        @BodyParam('email') email: string,
        @BodyParam('companyName') companyName: string,
        @BodyParam('contactNumber') contactNumber: string,
        @BodyParam('page', { required: false }) page?: string,
    ) {
        console.log('email:', email);
        return this.formSubmissionService.joinUsAsTravelAgency(email, companyName, contactNumber, page);
    }

    @Post('/contact-us')
    public async contactUs(
        @BodyParam('name') name: string,
        @BodyParam('email', { required: true }) email: string,
        @BodyParam('contactNumber', { required: true }) contactNumber: string,
        @BodyParam('message') message: string,
    ) {
        return this.formSubmissionService.contactUs(name, message, email, contactNumber);
    }
}