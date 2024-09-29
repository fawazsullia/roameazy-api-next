import { ObjectId } from "mongodb";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    _id: ObjectId;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password?: string;

    @Column()
    role: string;

    @Column({ default: Date.now })
    createdAt: Date;

    @Column({ default: Date.now })
    updatedAt: Date;

    @Column({ nullable: false })
    companyId: ObjectId;
}
