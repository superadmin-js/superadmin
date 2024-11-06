import * as s from '@superadmin/schema';

import { AuthData } from './AuthData.js';
import type { UserDefinition, UserSchema } from './defineUser.js';
import { defineAction } from '../actions/defineAction.js';
import { defineFunction } from '../functions/defineFunction.js';

export type AuthenticateInput = s.SchemaValue<typeof AuthenticateInput>;
export const AuthenticateInput = s.object({
    props: {
        userType: s.string(),
        userData: s.unknown<object>(),
    },
});

export const authenticateTransform = defineFunction({
    name: 'superadmin.authenticateTransform',
    params: s.nullable(AuthenticateInput),
    result: s.nullable(AuthData),
});

export const authenticateAction = defineAction({
    name: 'superadmin.authenticate',
    params: s.nullable(AuthData),
    sst: authenticateTransform,
});

export function authenticate(user: null | false): s.Action;
export function authenticate<TUser extends UserSchema>(
    user: UserDefinition<TUser>,
    data: Exclude<s.SchemaValue<TUser>, undefined | null> & object,
): s.Action;
export function authenticate(user: UserDefinition | null | false, data?: object) {
    if (user === null || user === false || !data) {
        return authenticateAction(null);
    }

    s.validateOrThrow(user.schema, data);

    return authenticateAction({
        userType: user.name,
        userData: s.serialize(user.schema, data) as object,
    });
}

export function logout() {
    return authenticateAction(null);
}
