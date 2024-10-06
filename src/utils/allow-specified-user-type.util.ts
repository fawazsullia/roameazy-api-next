import { SuperAdminRole, UserType } from "../enums";

export class AllowSpecifiedUserType {

    public static allowUserType(userType: (UserType | SuperAdminRole), allowedUserTypes: (UserType | SuperAdminRole)[], shouldThrow?: boolean): boolean {
        const userAllowed = allowedUserTypes.includes(userType);

        if (shouldThrow && !userAllowed) {
            throw new Error('User not allowed');
        }

        return userAllowed;
    }
}