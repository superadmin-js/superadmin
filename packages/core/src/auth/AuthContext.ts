/** Represents the current authentication context with the user type and user data. */
export type AuthContext<TUser extends object = object> = {
    /** Identifier of the user type (matches the name used in {@link defineUser}). */
    type: string;
    /** The authenticated user data. */
    user: TUser;
};
