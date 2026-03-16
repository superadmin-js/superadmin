import * as s from '@superadmin/schema';

import { defineAction } from '../actions/defineAction.js';
import { defineFunction } from '../functions/defineFunction.js';
import { AuthData } from './AuthData.js';
import type { UserDefinition, UserSchema } from './defineUser.js';

/** Inferred type of the {@link AuthenticateInput} schema. */
export type AuthenticateInput = s.Infer<typeof AuthenticateInput>;
/** Schema for the raw authentication input containing user type and user data. */
export const AuthenticateInput = s.object({
    props: {
        userType: s.string(),
        userData: s.unknown<object>(),
    },
});

/** Server-side transform that converts raw authentication input into full auth data with tokens. */
export const authenticateTransform = defineFunction({
    name: 'superadmin.authenticateTransform',
    params: s.nullable(AuthenticateInput),
    result: s.nullable(AuthData),
});

/** Action that triggers authentication or logout when given null. */
export const authenticateAction = defineAction({
    params: s.nullable(AuthData),
    sst: authenticateTransform,
});

/** Creates a logout action (overload for null/false). */
export function authenticate(user: false | null): s.Action;
/** Creates an authentication action for the given user type with user data. */
export function authenticate<TUser extends UserSchema>(
    user: UserDefinition<TUser>,
    data: Exclude<s.Infer<TUser>, null | undefined> & object,
): s.Action;
/** Creates an action that authenticates or logs out depending on the arguments. */
export function authenticate(user: UserDefinition | false | null, data?: object) {
    if (user === null || user === false || !data) {
        return authenticateAction(null);
    }

    s.validateOrThrow(user.schema, data as Record<string, unknown>);

    return authenticateAction({
        userType: user.name,
        userData: s.serialize(user.schema, data as Record<string, unknown>) as object,
    });
}

/** Convenience function that creates a logout action (alias for `authenticate(null)`). */
export function logout() {
    return authenticateAction(null);
}
