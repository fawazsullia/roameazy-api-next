import { UserType } from "../enums";

export type LoggedInUser = {
    _id: string;
    role: UserType;
    name: string;
}