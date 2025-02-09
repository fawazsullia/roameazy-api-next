import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { AirportTransfer, Meals } from "../enums";
import { Itinerary, ListingHotel, VariablePrice } from "../types";

export class UpdateListingRequest {

        @IsString()
        @IsOptional()
        title?: string;

        @IsBoolean()
        @IsOptional()
        isVerified?: boolean;

        @IsString({ each: true })
        @IsOptional()
        includedPlaces?: string[];

        @IsString({ each: true })
        @IsOptional()
        mealsIncluded?: Meals[];

        @IsBoolean()
        @IsOptional()
        travelInsurance?: boolean;

        @IsBoolean()
        @IsOptional()
        visa?: boolean;

        @IsArray()
        @IsOptional()
        hotels?: ListingHotel[];

        @IsBoolean()
        @IsOptional()
        airTickets?: boolean;

        @IsBoolean()
        @IsOptional()
        tourGuide?: boolean;

        @IsEnum(AirportTransfer)
        @IsOptional()
        airPortTransfers?: AirportTransfer;

        @IsString({ each: true })
        @IsOptional()
        itinerary: Itinerary[];

        @IsString({ each: true })
        @IsOptional()
        tags?: string[];

        @IsString()
        @IsOptional()
        startDate?: Date;

        @IsString()
        @IsOptional()
        endDate?: Date;

        @IsBoolean()
        @IsOptional()
        isActive?: boolean;

        @IsBoolean()
        @IsOptional()
        isFeatured?: boolean;

        @IsNumber()
        @IsOptional()
        basePrice?: number;

        @IsNumber()
        @IsOptional()
        basePriceSingle?: number;

        @IsString({ each: true })
        @IsOptional()
        images?: string[];

        @IsString()
        @IsOptional()
        overview?: string;

        @IsBoolean()
        @IsOptional()
        isTopPackage?: boolean;

        @IsString({ each: true })
        @IsOptional()
        termsAndConditions?: string[];

        @IsString({ each: true })
        @IsOptional()
        customInclusions?: string[];

        @IsString({ each: true })
        @IsOptional()
        customExclusions?: string[];
}