import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';

@Middleware({ type: 'before' })
export class RequestLoggerMiddleWare implements ExpressMiddlewareInterface {
    // eslint-disable-next-line class-methods-use-this
    public async use(request: any, response: any, next: () => Promise<unknown>): Promise<unknown> {
        console.log(`${new Date()} Request ${request.method} ${request.url}`);

        return next();
    }
}
