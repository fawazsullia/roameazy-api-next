import { ObjectId } from "mongodb";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Company {

    @PrimaryGeneratedColumn()
    _id: ObjectId;

    @Column()
    name: string;

    @Column({ default: false })
    isVerified: boolean;

    @Column({
        default: 'free'
    })
    plan: string;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;
}