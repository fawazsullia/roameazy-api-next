import { BodyParam, Controller, Get, JsonController, Post, QueryParam, Res, UploadedFile } from "routing-controllers";
import { Inject } from "typedi";
import { ResourceService } from "../services/resource.service";
import { Response } from "express";

@Controller('/resource')
export class ResourceController {

    @Inject()
    private resourceService: ResourceService;
    
    @Get('/')
    async getResourceById(
        @QueryParam('id') id: string,
        @Res() res: Response
    ) {
        return this.resourceService.get(id, res);
    }

    @Post()
    async createResource(
        @UploadedFile('file') file: Express.Multer.File,
        @BodyParam('folder', { required: false }) folder?: string
    ) {
        return this.resourceService.create(file, folder);
    }
}