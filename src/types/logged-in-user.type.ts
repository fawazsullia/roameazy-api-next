import { SuperAdminRole, UserType } from "src/enums";

export type LoggedInUser = {
    _id: string;
    role: SuperAdminRole & UserType;
    name: string;
}