import { Body, CurrentUser, Get, JsonController, Param, Post, UploadedFiles, UseBefore } from "routing-controllers";
import { Inject } from "typedi";
import { ListingService } from "../services/listing.service";
import { CreateListingRequest, GetListingRequest, SuccessReponse } from "../models";
import { User } from "../orm/entities";
import { AllowSpecifiedUserType } from "../utils/allow-specified-user-type.util";
import { UserType } from "../enums";
import { AuthMiddleware } from "../middlewares/auth.middleware";

@JsonController('/listing')
export class ListingController {

    @Inject()
    private listingService: ListingService;

    @Post()
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

    @Get('/:listingId')
    async getListingById(
        @Param('listingId') listingId: string
    ) {
        return this.listingService.getListingById(listingId);
    }
}