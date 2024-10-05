import { IsBoolean, IsIn, IsNumber, IsOptional, IsString } from "class-validator";

export class GetListingRequest {

    @IsNumber()
    offset: number;

    @IsNumber()
    limit: number;

    @IsOptional()
    @IsString()
    from?: string;

    @IsOptional()
    @IsString()
    to?: string;

    @IsOptional()
    @IsString()
    @IsIn(['active', 'inactive', 'all'])
    listingType?: 'active' | 'inactive' | 'all'; 

    @IsString()
    startDate: string;

    @IsString()
    endDate: string;

    @IsBoolean()
    @IsOptional()
    isFeatured?: boolean;

    @IsNumber()
    @IsOptional()
    budgetMin?: number;

    @IsNumber()
    @IsOptional()
    budgetMax?: number;

    @IsBoolean()
    @IsOptional()
    isFlightIncluded?: boolean;

    @IsNumber()
    @IsOptional()
    maxNights?: number;

    @IsNumber()
    @IsOptional()
    minNights?: number;

    @IsString()
    @IsOptional()
    sortKey?: string;

    @IsNumber()
    @IsOptional()
    sortOrder?: number;
}