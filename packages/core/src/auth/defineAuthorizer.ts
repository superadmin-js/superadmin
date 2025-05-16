import type { AuthContext } from './AuthContext.js';

/**
 *
 */
export interface Authorizer {
    /**
     *
     */
    isAuthorized: (context: AuthContext | null) => boolean;
}

/**
 *
 */
export function defineAuthorizer(fn: (ctx: AuthContext | null) => boolean): Authorizer {
    return Object.freeze({
        isAuthorized: fn,
    });
}

/**
 *
 */
export const noAuth = defineAuthorizer(() => true);

/**
 *
 */
export const loggedIn = defineAuthorizer(ctx => ctx !== null);

/**
 *
 */
export function resolveAuthorizer(auth: Authorizer | false | undefined | null) {
    if (auth === false) {
        return noAuth;
    }

    if (!auth) {
        return loggedIn;
    }

    return auth;
}
