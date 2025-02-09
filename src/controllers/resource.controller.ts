import { BodyParam, Controller, Get, Post, QueryParam, Res, UploadedFile } from "routing-controllers";
import { Inject } from "typedi";
import { ResourceService } from "../services/resource.service";
import { Response } from "express";

@Controller('/resource')
export class ResourceController {

    @Inject()
    private resourceService: ResourceService;
    
    @Get('/')
    async getResourceById(
        @Res() res: Response,
        @QueryParam('id') id: string,
    ) {
        return this.resourceService.get(id, res);
    }

    @Post()
    async createResource(
        @UploadedFile('file') file: Express.Multer.File,
        @BodyParam('folder', { required: false }) folder?: string,
        @BodyParam('companyName', { required: false }) companyName?: string
    ) {
        return this.resourceService.create(file, folder, companyName);
    }
}