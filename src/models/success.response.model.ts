import { IsBoolean } from "class-validator";

export class SuccessReponse {

    @IsBoolean()
    success: boolean;

    constructor() {
        this.success = true;
    }
}