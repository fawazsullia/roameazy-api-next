import { UserType } from "../enums";

export class AllowSpecifiedUserType {

    public static allowUserType(userType: UserType, allowedUserTypes: UserType[], shouldThrow?: boolean): boolean {
        const userAllowed = allowedUserTypes.includes(userType);

        if (shouldThrow && !userAllowed) {
            throw new Error('User not allowed');
        }

        return userAllowed;
    }
}