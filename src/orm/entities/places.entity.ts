import { ObjectId } from "mongodb";
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Place {

    @PrimaryGeneratedColumn()
    _id: ObjectId;

    @Column({ nullable: false, unique: true })
    placeId: string;

    @Index({ unique: true })
    @Column()
    name: string;

    @Column()
    country: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ type: String, default: "country" })
    type: string;

    @Column({ default: [] })
    images: string[];

    @Column({ default: false })
    isDeparture: boolean;

    @Column({ default: false })
    isDestination: boolean;

    @Column({ default: Date.now })
    createdAt: Date;

    @Column({ default: Date.now })
    updatedAt: Date;

    @Column({ default: true })
    isActive: boolean;
}