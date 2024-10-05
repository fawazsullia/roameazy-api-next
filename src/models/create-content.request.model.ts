import { IsObject, IsString } from "class-validator";

export class CreateContentRequest {
    
    @IsString()
    key: string;

    @IsString()
    group: string;

    @IsObject()
    data: { [key: string]: any };
}