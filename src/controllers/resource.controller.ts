import { Get, JsonController, QueryParam, Res } from "routing-controllers";
import { Inject } from "typedi";
import { ResourceService } from "../services/resource.service";
import { Query } from "mongoose";
import { Response } from "express";

@JsonController('/resource')
export class ResourceController {

    @Inject()
    private resourceService: ResourceService;
    
    @Get()
    async getResourceById(
        @QueryParam('id') id: string,
        @Res() res: Response
    ) {
        return this.resourceService.get(id, res);
    }
}