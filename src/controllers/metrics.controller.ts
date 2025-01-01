import { BodyParam, JsonController, Post } from "routing-controllers";
import { Inject } from "typedi";
import { MetricsService } from "../services";
import { MetricsEvent } from "../enums";
import { SuccessReponse } from "../models";

@JsonController("/metrics")
export class MetricsController {

    @Inject()
    private metricsService: MetricsService;

    @Post('/event')
    public async createEvent(
        @BodyParam('event') event: MetricsEvent,
        @BodyParam('listingId', { required: false }) listingId?: string,
        @BodyParam('companyId', { required: false }) companyId?: string,
        @BodyParam('eventParams', { required: false }) eventParams?: { [key: string]: unknown },
    ) {
        await this.metricsService.trackEvent(event, listingId, companyId, eventParams);
        return new SuccessReponse();
    }

}