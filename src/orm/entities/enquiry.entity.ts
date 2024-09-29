import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ObjectId } from "mongodb";
import { EnquirySource } from "../../enums";

@Entity()
export class Enquiry {

    @PrimaryGeneratedColumn()
    _id: ObjectId;

    @Column({ nullable: false })
    listingId: ObjectId;

    @Column({ nullable: false })
    companyId: ObjectId;

    @Column({ nullable: false })
    createdAt: Date;

    @Column({ nullable: false })
    source: EnquirySource

}