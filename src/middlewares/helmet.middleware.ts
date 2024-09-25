import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import Helmet from "helmet";

@Middleware({ type: "after"})
export class HelmetMiddleware implements ExpressMiddlewareInterface {
    use(request: any, response: any, next: (err?: any) => any) {
        return Helmet();
    }
}