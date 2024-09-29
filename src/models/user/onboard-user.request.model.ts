import { IsString } from "class-validator";

export class OnboardUserRequest {
    
    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsString()
    companyName: string;

    @IsString()
    companyAddress: string;

    @IsString()
    companyEmail: string;

    @IsString()
    companyPhone: string;

    @IsString()
    companyDescription: string;

}