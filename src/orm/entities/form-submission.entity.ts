import { ObjectId } from "mongodb";
import { Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from "typeorm";

@Entity('form_submissions')
export class FormSubmission {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    context: string;

    @Column()
    data: { [key: string]: any };

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}