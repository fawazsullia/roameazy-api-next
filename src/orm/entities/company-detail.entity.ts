import { ObjectId } from "mongodb";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CompanyDetail {

    @PrimaryGeneratedColumn()
    _id: ObjectId;

    @Column({ nullable: false })
    description: string;

    @Column({ nullable: true, type: String })
    logo: string;

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
    companyId: ObjectId;

    @Column({ nullable: false })
    createdAt: Date;

    @Column({ nullable: false })
    tradeLicense: string;

    @Column({ nullable: false })
    updatedAt: Date;
}