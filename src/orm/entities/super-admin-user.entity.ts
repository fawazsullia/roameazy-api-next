import { ObjectId } from "mongodb";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('superadminusers')
export class SuperAdminUser {

    @PrimaryGeneratedColumn()
    _id: ObjectId;

    @Column({ nullable: false, unique: true })
    name: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: false, unique: true })
    email: string;

    @Column({ nullable: false })
    role: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: Date.now })
    createdAt: Date;

    @Column({ default: Date.now })
    updatedAt: Date;
}