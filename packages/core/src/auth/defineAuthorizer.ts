import type { AuthContext } from './AuthContext.js';

/** An object that determines whether an auth context is authorized for a given resource. */
export interface Authorizer {
    /** Returns true if the given auth context (or null for unauthenticated) is authorized. */
    isAuthorized: (context: AuthContext | null) => boolean;
}

/** Creates an authorizer from a predicate function. */
export function defineAuthorizer(fn: (ctx: AuthContext | null) => boolean): Authorizer {
    return Object.freeze({
        isAuthorized: fn,
    });
}

/** Authorizer that permits all access, including unauthenticated requests. */
export const noAuth = defineAuthorizer(() => true);

/** Authorizer that requires a logged-in user (non-null context). */
export const loggedIn = defineAuthorizer(ctx => ctx !== null);

/** Resolves an authorizer option: false means no auth, null/undefined defaults to logged-in. */
export function resolveAuthorizer(auth: Authorizer | false | null | undefined) {
    if (auth === false) {
        return noAuth;
    }

    if (!auth) {
        return loggedIn;
    }

    return auth;
}
