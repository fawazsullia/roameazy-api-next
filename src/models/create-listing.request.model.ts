import { IsBoolean, IsEnum, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { AirportTransfer, Meals } from "../enums";
import { Itinerary, ListingHotel, VariablePrice } from "../types";

export class CreateListingRequest {
    @IsString()
    title: string;

    @IsString()
    from: string;

    @IsString()
    to: string;

    @IsString({ each: true })
    includedPlaces: string[];

    @IsNumber()
    numberOfNights: number;

    @IsString({ each: true })
    mealsIncluded: Meals[];

    @IsBoolean()
    travelInsurance: boolean;

    @IsBoolean()
    @IsOptional()
    visa?: boolean;

    @IsOptional()
    @IsObject({ each: true })
    hotels?: ListingHotel[];

    @IsEnum(AirportTransfer)
    @IsOptional()
    airPortTransfers?: AirportTransfer;

    @IsObject({ each: true })
    itinerary: Itinerary[];

    @IsString({ each: true })
    tags?: string[];

    @IsString()
    startDate: string;

    @IsString()
    endDate: string;

    @IsNumber()
    basePrice: number;

    @IsObject({ each: true })
    @IsOptional()
    variablePrices?: VariablePrice[];

    @IsBoolean()
    @IsOptional()
    airTickets?: boolean;

    @IsBoolean()
    @IsOptional()
    tourGuide?: boolean;

    @IsNumber()
    @IsOptional()
    basePriceSingle?: number;

}