import { Body, CurrentUser, Get, JsonController, Param, Patch, Post, UploadedFiles, UseBefore } from "routing-controllers";
import { Inject } from "typedi";
import { ListingService } from "../services/listing.service";
import { CreateListingRequest, GetListingRequest, SuccessReponse, UpdateListingRequest } from "../models";
import { User } from "../orm/entities";
import { AllowSpecifiedUserType } from "../utils/allow-specified-user-type.util";
import { UserType } from "../enums";
import { AuthMiddleware } from "../middlewares/auth.middleware";

@JsonController('/listing')
export class ListingController {

    @Inject()
    private listingService: ListingService;

    @Post('/')
    @UseBefore(AuthMiddleware)
    async create(
        @Body() body: CreateListingRequest,
        @UploadedFiles('files') files: Express.Multer.File[],
        @CurrentUser() user: User
    ) {
        AllowSpecifiedUserType.allowUserType(user.role, [UserType.ADMIN], true);
        await this.listingService.create(body, files, user);
        return new SuccessReponse();
    }

    @Post('/get-listings')
    async getListings(

        @Body() body: GetListingRequest
    ) {
        return this.listingService.get(body);
    }

    @Get('/get-package/:listingId')
    public async getListingById(
        @Param('listingId') listingId: string
    ) {
        return this.listingService.getListingById(listingId);
    }

    @Patch('/:listingId')
    public async updateListing(
        @Param('listingId') listingId: string,
        @Body() body: UpdateListingRequest
    ){
        return this.listingService.updateListing(listingId, body);
    }
}