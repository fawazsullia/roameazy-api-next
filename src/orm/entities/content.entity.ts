// This will store stuff that is related to pages to be generated, for example, bali listings and the content related to it

import { ObjectId } from "mongodb";
import { Column, Entity, ObjectIdColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('contents')
export class Content {

    @ObjectIdColumn()
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