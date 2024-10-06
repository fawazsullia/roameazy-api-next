// create an auth middleware which has a method called 'verifyToken' which will verify the token from cookies or header and set the user in the request object

import { NextFunction, Request, Response } from "express";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import { jwtutils } from "../utils/jwt.utils";
import Container from "typedi";
import { UserService } from "../services";
import { LoggedInUser } from "../types/logged-in-user.type";
import { SuperAdminRole } from "../enums";

// use class based middleware that routing controllers support
@Middleware({ type: 'before' })
export class AuthMiddleware implements ExpressMiddlewareInterface {
    async use(request: Request, response: Response, next: NextFunction) {
        let token = request.cookies?.token;
        console.log('token===================>', token);
        if (!token) {
            token = request.headers['authorization'];
            token = token?.split(' ')[1];
        }
        if (!token) {
            return response.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const decoded: LoggedInUser = await jwtutils.verify(token);
            console.log('decoded===================>', decoded);
            const userService = Container.get(UserService);

            const user = await userService.getUserById(decoded._id, (decoded.role === SuperAdminRole.CORE || decoded.role === SuperAdminRole.STAFF));
            console.log('user===================>' + user);
            if (!user) {
                return response.status(401).json({ message: 'Unauthorized' });
            }
            request.user = user;

            return next();
        } catch (err) {
            console.log(err);
            return response.status(401).json({ message: 'Unauthorized' });
        }
    }
}

