import { Service } from 'typedi';
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';

@Service()
@Middleware({ type: 'after' })
export class ErrorFormatHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, request: any, response: any, next: () => any) {
        const status = error.httpCode || error.statusCode || request.statusCode || 400;
        console.log('[Operation Failed]', error);

        if ((<any>error).errorIdentifier) delete (<any>error).errorIdentifier;
        if ((<any>error).stack) delete (<any>error).stack;
        response.status(status).json(Object.keys(error).length === 0 ? { message: error.message } : error);
        next();
    }
}
