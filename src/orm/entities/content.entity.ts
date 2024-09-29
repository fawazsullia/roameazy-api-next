// This will store stuff that is related to pages to be generated, for example, bali listings and the content related to it

import { ObjectId } from "mongodb";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Content {

    @PrimaryGeneratedColumn()
    _id: ObjectId;

    @Column()
    key: string;

    @Column()
    data: { [key: string]: any };

    @Column()
    group: string;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;
}