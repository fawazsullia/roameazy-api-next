import { IsString } from "class-validator";

export class GetContentRequest {
    
    @IsString()
    key: string;

    @IsString()
    group: string;
}