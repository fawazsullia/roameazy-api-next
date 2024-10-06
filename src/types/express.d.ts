import { SuperAdminUser, User } from "../orm/entities";
import { LoggedInUser } from "./logged-in-user.type";

// types/express.d.ts
declare global {
  namespace Express {
    export interface Request {
      user?: SuperAdminUser | User;
    }
  }
}
