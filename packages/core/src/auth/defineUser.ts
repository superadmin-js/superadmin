import type { ObjectSchema, ObjectSchemaProps, SchemaValue } from '@superadmin/schema';

import type { AuthContext } from './AuthContext.js';
import type { Authorizer } from './defineAuthorizer.js';
import { MODULE_SYMBOL, type Module } from '../defineModule.js';
import { AuthRegistry } from './AuthRegistry.js';

const USER_MODULE_SYMBOL = Symbol('User');

export type UserSchema = ObjectSchema<{
    props: ObjectSchemaProps;
    nullable: false;
    optional: false;
}>;

export interface UserConfig<TSchema extends UserSchema> {
    name: string;
    schema: TSchema;
}

export interface UserDefinition<TSchema extends UserSchema = UserSchema>
    extends UserConfig<TSchema>,
        Authorizer,
        Module {
    with: (condition: (user: SchemaValue<TSchema>) => boolean) => Authorizer;
}

export function defineUser<TSchema extends UserSchema>(config: UserConfig<TSchema>) {
    const name = config.name;
    const schema = config.schema;

    return Object.freeze<UserDefinition<TSchema>>({
        [MODULE_SYMBOL]: USER_MODULE_SYMBOL,
        name,
        schema,
        isAuthorized,
        install(container) {
            container.resolve(AuthRegistry).registerUserType(this);
        },
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
