import * as s from '@superadmin/schema';

import type { AuthContext } from './AuthContext.js';
import type { Authorizer } from './defineAuthorizer.js';
import { MODULE_SYMBOL, type Module } from '../defineModule.js';
import { AuthRegistry } from './AuthRegistry.js';
import { refreshAuthTransform } from './refreshAuthTransform.js';
import { type ActionDefinition, defineAction } from '../actions/defineAction.js';
import type { FunctionDefinition } from '../functions/defineFunction.js';

const USER_MODULE_SYMBOL = Symbol('User');

export type UserSchema = s.ObjectSchema<{
    props: s.ObjectSchemaProps;
    nullable: false;
    optional: false;
}>;

export interface UserConfig<TSchema extends UserSchema> {
    name: string;
    schema: TSchema;
    authExpiration?: number;
    refreshExpiration?: number;
}

export interface UserDefinition<TSchema extends UserSchema = UserSchema>
    extends UserConfig<TSchema>,
        Authorizer,
        Module {
    with: (condition: (user: s.SchemaValue<TSchema>) => boolean) => Authorizer;
    authExpiration: number;
    refreshExpiration: number;
    actions: {
        refresh: ActionDefinition<TSchema, s.ActionSchema, s.Schema<string, object>>;
    };
}

export function defineUser<TSchema extends UserSchema>(config: UserConfig<TSchema>) {
    const name = config.name;
    const schema = config.schema;

    return Object.freeze<UserDefinition<TSchema>>({
        [MODULE_SYMBOL]: USER_MODULE_SYMBOL,
        name,
        schema,
        authExpiration: config.authExpiration ?? 15 * 60 * 1000,
        refreshExpiration: config.refreshExpiration ?? 30 * 24 * 60 * 60 * 1000,
        isAuthorized,
        install(container) {
            container.resolve(AuthRegistry).registerUserType(this);
            this.actions.refresh.install(container);
        },
        with(condition) {
            return {
                isAuthorized(ctx) {
                    return isAuthorized(ctx) && condition(ctx.user);
                },
            };
        },
        actions: {
            refresh: defineAction({
                name: `${name}.refresh`,
                auth: false,
                params: schema,
                result: s.action({ nullable: true }),
                sst: refreshAuthTransform as FunctionDefinition<s.Schema<string, object>, TSchema>,
                handler: () => () => null,
            }),
        },
    });

    function isAuthorized(ctx: AuthContext | null): ctx is AuthContext<s.SchemaValue<TSchema>> {
        if (ctx === null) {
            return false;
        }

        if (ctx.type !== name) {
            return false;
        }

        return true;
    }
}
