import { Get, JsonController } from "routing-controllers";

@JsonController('/app')
export class AppController {
    constructor() { }

    @Get('/live')
    public async live(): Promise<boolean> {
        return true;
    }
}
