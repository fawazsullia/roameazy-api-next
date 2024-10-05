import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreatePlaceRequest {

    @IsString()
    name: string;

    @IsString()
    country: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    type?: string;

    @IsString({ each: true })
    @IsOptional()
    images?: string[];

    @IsBoolean()
    @IsOptional()
    isDeparture?: boolean;

    @IsBoolean()
    @IsOptional()
    isDestination?: boolean;

    @IsString()
    placeId: string;
    
}