import * as s from '@superadmin/schema';

/** Inferred type of the {@link AuthData} schema. */
export type AuthData = s.Infer<typeof AuthData>;
/** Schema describing the authentication payload including tokens and expiration timestamps. */
export const AuthData = s.object({
    userType: s.string(),
    userData: s.unknown<object>(),
    timestamp: s.date(),
    authToken: s.string(),
    authExpiration: s.date(),
    refreshToken: s.string(),
    refreshExpiration: s.date(),
});
