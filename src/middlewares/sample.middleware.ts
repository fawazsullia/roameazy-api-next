import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";

@Middleware({ type: 'before'})
export class SampleMiddleware implements ExpressMiddlewareInterface {
    use(request: any, response: any, next: (err?: any) => any) {
        return next();
    }
}