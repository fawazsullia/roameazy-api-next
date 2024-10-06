import { SuperAdminRole, UserType } from "../enums";

export type LoggedInUser = {
    _id: string;
    role: SuperAdminRole & UserType;
    name: string;
}