import * as s from '@superadmin/schema';

import { defineAction } from '../actions/defineAction.js';
import { defineFunction } from '../functions/defineFunction.js';
import { AuthData } from './AuthData.js';
import type { UserDefinition, UserSchema } from './defineUser.js';

/**
 *
 */
export type AuthenticateInput = s.Infer<typeof AuthenticateInput>;
/**
 *
 */
export const AuthenticateInput = s.object({
    props: {
        userType: s.string(),
        userData: s.unknown<object>(),
    },
});

/**
 *
 */
export const authenticateTransform = defineFunction({
    name: 'superadmin.authenticateTransform',
    params: s.nullable(AuthenticateInput),
    result: s.nullable(AuthData),
});

/**
 *
 */
export const authenticateAction = defineAction({
    params: s.nullable(AuthData),
    sst: authenticateTransform,
});

/**
 *
 */
export function authenticate(user: false | null): s.Action;
/**
 *
 */
export function authenticate<TUser extends UserSchema>(
    user: UserDefinition<TUser>,
    data: Exclude<s.Infer<TUser>, null | undefined> & object,
): s.Action;
/**
 *
 */
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

/**
 *
 */
export function logout() {
    return authenticateAction(null);
}
