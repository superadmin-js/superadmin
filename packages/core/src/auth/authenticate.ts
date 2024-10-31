import * as s from '@superadmin/schema';

import { AuthData } from './AuthData.js';
import type { UserDefinition, UserSchema } from './defineUser.js';
import type { ActionOf } from '../actions/defineAction.js';
import { defineAction } from '../actions/defineAction.js';

export type AuthenticateAction = ActionOf<typeof authenticateAction>;
export const authenticateAction = defineAction({
    name: 'superadmin.authenticate',
    params: AuthData,
});

export function authenticate<TUser extends UserSchema>(
    user: UserDefinition<TUser>,
    data: Exclude<s.SchemaValue<TUser>, undefined | null> & object,
) {
    s.validateOrThrow(user.schema, data);

    return authenticateAction({
        userType: user.name,
        userData: s.serialize(user.schema, data) as object,
        timestamp: new Date(0),
        authToken: '',
        authExpiration: new Date(0),
        refreshToken: '',
        refreshExpiration: new Date(0),
    });
}
