import { Service } from "typedi";
import { MetricsEvent } from "../enums";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Metrics } from "../orm/entities";
import { MongoRepository } from "typeorm";

@Service()
export class MetricsService {

    @InjectRepository(Metrics)
    private metricsRepository: MongoRepository<Metrics>;

    public async trackEvent(event: MetricsEvent, listingId?: string, companyId?: string, eventParams?: { [key: string]: unknown }) {
        const metrics = new Metrics();
        metrics.event = event;
        if (listingId) metrics.listingId = listingId;
        if (companyId) metrics.companyId = companyId;
        if (eventParams) metrics.eventParams = eventParams;
        await this.metricsRepository.save(metrics);
    }
}