import { IsBoolean, IsEnum, IsObject, IsOptional, IsString } from "class-validator";
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

    @IsString()
    numberOfNights: string;

    @IsString({ each: true })
    mealsIncluded: Meals[];

    @IsString()
    travelInsurance: string;

    @IsString()
    @IsOptional()
    visa?: string;

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

    @IsString()
    basePrice: string;

    @IsObject({ each: true })
    @IsOptional()
    variablePrices?: VariablePrice[];

    @IsString()
    @IsOptional()
    airTickets?: string;

    @IsString()
    @IsOptional()
    tourGuide?: string;

    @IsString()
    @IsOptional()
    basePriceSingle?: string;

    @IsString()
    @IsOptional()
    overView?: string;

}