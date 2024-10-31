export type AuthContext<TUser extends object = object> = {
    type: string;
    user: TUser;
};
