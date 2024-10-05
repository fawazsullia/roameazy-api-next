import { IsEnum, IsString } from "class-validator";
import { SuperAdminRole } from "../../enums";

export class CreateSuperAdminRequest {
    @IsString()
    username: string;

    @IsString()
    password: string;

    @IsString()
    confirmPassword: string;

    @IsString()
    email: string;

    @IsEnum(SuperAdminRole)
    role: SuperAdminRole;

}