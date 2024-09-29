import { IsOptional, IsString } from "class-validator";
import { SuperAdminUser } from "src/schemas/super-admin-user.schema";
import { User } from "src/schemas/user.schema";

export class UserGeneticResponse {

    @IsString()
    name: string;

    @IsString()
    email: string;
    
    @IsString()
    role: string;

    @IsString()
    createdAt: Date;

    @IsString()
    updatedAt: Date;

    @IsString()
    @IsOptional()
    companyId: string;

    constructor(user: SuperAdminUser & User) {
        this.name = user.name;
        this.email = user.email;
        this.role = user.role;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
        if (user.companyId) {
            this.companyId = user.companyId.toString();
        }
    }
}