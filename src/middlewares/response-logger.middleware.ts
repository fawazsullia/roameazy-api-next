import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';

@Middleware({ type: 'after' })
export class ResponseLoggerMiddleware implements ExpressMiddlewareInterface {
    // eslint-disable-next-line class-methods-use-this
    public use(request: any, response: any): void {
        if (!response.headersSent) {
            response.status(404);
            response.send({ statusCode: 404, message: 'Not found' });
            response.end();
        }
        const responseTime = new Date().getTime() - response.locals.startTime.getTime();
        console.log(`Response took ${responseTime}ms with status code ${response.statusCode}`);
    }
}
