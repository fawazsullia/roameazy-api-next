import { Body, JsonController, Post } from "routing-controllers";
import { Inject } from "typedi";
import { CreateContentRequest, GetContentRequest, UpdateContentRequest } from "../models";
import { ContentService } from "../services/content.service";

@JsonController('/content')
export class ContentController {

    @Inject()
    private contentService: ContentService;
  
    @Post()
    async create(
        @Body() body: CreateContentRequest
    ) {
        return this.contentService.create(body);
    }

    @Post('/update')
    async update(
        @Body() body: UpdateContentRequest
    ) {
        return this.contentService.update(body);
    }

    @Post('/get')
    async get(
        @Body() body: GetContentRequest
    ) {
        return this.contentService.get(body);
    }
}