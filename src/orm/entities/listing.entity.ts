import { Column, Entity, ObjectIdColumn } from "typeorm";
import { AirportTransfer, Meals } from "../../enums";
import { Itinerary, ListingHotel, VariablePrice } from "../../types";
import { ObjectId } from "mongodb";

@Entity('listings')
export class Listing {

    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    listingId: string

    @Column()
    title: string;

    // a listing will not be shown if not verified
    @Column()
    isVerified: boolean;

    @Column()
    from: string;

    @Column()
    to: string; // this will be the country

    @Column()
    includedPlaces: string[];

    @Column()
    numberOfNights: number;

    // these are whatsa included in the package
    @Column()
    mealsIncluded: Meals[];

    @Column()
    travelInsurance: boolean;

    @Column({ nullable: true })
    visa?: boolean;

    @Column({ nullable: true })
    hotels?: ListingHotel[];

    @Column({ default: false })
    airTickets: boolean;

    @Column({ default: false })
    tourGuide: boolean;

    @Column()
    airPortTransfers?: AirportTransfer;

    // included ends here

    @Column({ nullable: false })
    itinerary: Itinerary[];

    @Column({ nullable: true })
    tags?: string[];

    @Column({ nullable: false })
    startDate: Date;

    @Column({ nullable: false })
    endDate: Date;

    @Column({ default: Date.now })
    createdAt: Date;

    @Column({ default: Date.now })
    updatedAt: Date;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: false })
    isFeatured: boolean;

    @Column({ nullable: false })
    basePrice: number;

    @Column({ default: [] })
    variablePrices: VariablePrice[];

    @Column({ default: 0 })
    price: number; // this is the total price including variable prices

    @Column({ nullable: true })
    basePriceSingle: number;

    @Column({ default: 0 })
    priceSingle: number;

    @Column({ nullable: false })
    createdBy: string;

    @Column({ nullable: false })
    companyId: string;

    @Column({ default: [] })
    images: string[];

    @Column({ nullable: true })
    overview?: string;

    @Column({ default: false })
    isTopPackage: boolean;

    @Column({ nullable: true })
    termsAndConditions?: string[];
}