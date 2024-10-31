import * as s from '@superadmin/schema';

export type AuthData = s.SchemaValue<typeof AuthData>;
export const AuthData = s.object({
    props: {
        userType: s.string(),
        userData: s.unknown<object>(),
        timestamp: s.date(),
        authToken: s.string(),
        authExpiration: s.date(),
        refreshToken: s.string(),
        refreshExpiration: s.date(),
    },
});
