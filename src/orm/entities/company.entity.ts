import { ObjectId } from "mongodb";
import { Column, Entity, ObjectIdColumn } from "typeorm";

@Entity('companies')
export class Company {

    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    name: string;

    @Column({ default: false })
    isVerified: boolean;

    @Column({
        default: 'free'
    })
    plan: string;

    @Column({ default: false })
    isRoamEazy: boolean;


    @Column()
    token: string;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;
}