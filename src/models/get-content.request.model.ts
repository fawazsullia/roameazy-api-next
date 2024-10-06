import { IsNumber, IsOptional, IsString } from "class-validator";

export class GetContentRequest {
    
    @IsString()
    key: string;

    @IsString()
    group: string;

    @IsNumber()
    @IsOptional()
    limit?: number;

    @IsNumber()
    @IsOptional()
    offset?: number;
}