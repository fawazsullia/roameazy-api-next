import { IsObject, IsString } from "class-validator";

export class UpdateContentRequest {
    
    @IsString()
    key: string;

    @IsString()
    group: string;

    @IsObject()
    data: { [key: string]: any };
}