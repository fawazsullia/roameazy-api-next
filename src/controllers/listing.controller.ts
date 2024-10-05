import { Body, Get, JsonController, Param, Post, UploadedFiles } from "routing-controllers";
import { Inject } from "typedi";
import { ListingService } from "../services/listing.service";
import { CreateListingRequest, GetListingRequest, SuccessReponse } from "../models";

@JsonController('/listing')
export class ListingController {

    @Inject()
    private listingService: ListingService;

    @Post()
    async create(
        @Body() body: CreateListingRequest,
        @UploadedFiles('files') files: Express.Multer.File[]
    ) {
        await this.listingService.create(body, files);
        return new SuccessReponse();
    }

    @Post('/get-listings')
    async getListings(

        @Body() body: GetListingRequest
    ) {
        return this.listingService.get(body);
    }

    @Get(':listingId')
    async getListingById(
        @Param('listingId') listingId: string
    ) {
        return this.listingService.getListingById(listingId);
    }
}