import { ObjectId } from "mongodb";
import { Column, Entity, Index, ObjectIdColumn } from "typeorm";
import { UserType } from "../../enums";

@Entity('users')
export class User {

    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    name: string;

    @Index({ unique: true })
    @Column()
    email: string;

    @Column()
    password?: string;

    @Column()
    role: UserType;

    @Column({ default: Date.now })
    createdAt: Date;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: Date.now })
    updatedAt: Date;

    @Column({ nullable: false })
    companyId: ObjectId;
}
