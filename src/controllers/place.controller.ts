import { Body, JsonController, Post } from "routing-controllers";
import { Inject } from "typedi";
import { PlaceService } from "../services/place.service";
import { CreatePlaceRequest, GetDepartingPlacesRequest, SuccessReponse } from "../models";

@JsonController('/place')
export class PlaceController {

    @Inject()
    private placeService: PlaceService;

    @Post()
    async create(
        @Body() body: CreatePlaceRequest
    ) {
        await this.placeService.create(body);
        return new SuccessReponse();
    }

    @Post('get-departing')
    async getDeparting(
        @Body() body: GetDepartingPlacesRequest
    ) {
        return this.placeService.getDeparting(body);
    }

    @Post('get-destination')
    async getDestination(
        @Body() body: GetDepartingPlacesRequest
    ) {
        return this.placeService.getDestinations(body);
    }
}