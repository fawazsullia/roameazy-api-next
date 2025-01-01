import { Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from "typeorm";
import { MetricsEvent } from "../../enums";

@Entity()
export class Metrics {

    @ObjectIdColumn()
    _id: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ enum: MetricsEvent })
    event: MetricsEvent;

    @Column({ nullable: true })
    listingId?: string;

    @Column({ nullable: true })
    companyId?: string;

    @Column({ nullable: true })
    eventParams?: { [key: string]: unknown };
}