import { IsNumber, IsOptional, IsString } from "class-validator";

export class GetDepartingPlacesRequest {

    @IsNumber()
    limit: number;

    @IsNumber()
    offset: number;

    @IsString()
    @IsOptional()
    searchTerm?: string;

    @IsString()
    @IsOptional()
    country?: string;
}