import { Get, JsonController } from "routing-controllers";
import { Inject } from "typedi";
import { SampleService } from "../services/sample.service";

@JsonController("/sample")
export class Sample {
    
    @Inject()
    private readonly sampleService: SampleService;

    @Get("/")
    public async sample () {
        console.log("--------------------->")
        return this.sampleService.sample();
    }
}