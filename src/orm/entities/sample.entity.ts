import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Sample {
    @PrimaryGeneratedColumn('uuid')
    id: string;

}