import { ObjectId } from "mongodb";
import { Column, Entity, ObjectIdColumn } from "typeorm";

@Entity('companydetails')
export class CompanyDetail {

    @ObjectIdColumn()
    _id: ObjectId;

    @Column({ nullable: false })
    description: string;

    @Column({ nullable: true, type: String })
    logo?: string;

    @Column({ nullable: false })
    address: string;

    @Column({ nullable: false })
    email: string;

    @Column({ default: '', type: String })
    alternateEmail?: string;

    @Column({ nullable: false })
    phone: string;

    @Column({ default: '', })
    alternatePhone?: string;

    @Column({ nullable: true })
    companyId: string;

    @Column({ nullable: false })
    createdAt: Date;

    @Column({ nullable: false })
    tradeLicense: string;

    @Column({ nullable: false })
    updatedAt: Date;

    @Column({ nullable: true })
    termsAndConditions?: string[];
}