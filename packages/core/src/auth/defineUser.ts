import type { ObjectSchemaAny, SchemaValue } from '@superadmin/schema';

import type { AuthContext } from './AuthContext.js';
import type { Authorizer } from './defineAuthorizer.js';

export interface UserConfig<TSchema extends ObjectSchemaAny> {
    name: string;
    schema: TSchema;
}

export interface UserDefinition<TSchema extends ObjectSchemaAny>
    extends UserConfig<TSchema>,
        Authorizer {
    with: (condition: (user: SchemaValue<TSchema>) => boolean) => Authorizer;
}

export function defineUser<TSchema extends ObjectSchemaAny>(config: UserConfig<TSchema>) {
    const name = config.name;
    const schema = config.schema;

    return Object.freeze<UserDefinition<TSchema>>({
        name,
        schema,
        isAuthorized,
        with(condition) {
            return {
                isAuthorized(ctx) {
                    return isAuthorized(ctx) && condition(ctx.user);
                },
            };
        },
    });

    function isAuthorized(ctx: AuthContext | null): ctx is AuthContext<SchemaValue<TSchema>> {
        if (ctx === null) {
            return false;
        }

        if (ctx.type !== name) {
            return false;
        }

        return true;
    }
}
