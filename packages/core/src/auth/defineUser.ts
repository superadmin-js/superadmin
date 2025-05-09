import { defineInjectable } from '@nzyme/ioc';

import * as s from '@superadmin/schema';

import { defineAction } from '../actions/defineAction.js';
import type { ActionDefinition } from '../actions/defineAction.js';
import { defineSubmodule } from '../defineSubmodule.js';
import type { Submodule } from '../defineSubmodule.js';
import type { FunctionDefinition } from '../functions/defineFunction.js';
import type { AuthContext } from './AuthContext.js';
import { AuthRegistry } from './AuthRegistry.js';
import type { Authorizer } from './defineAuthorizer.js';
import { refreshAuthTransform } from './refreshAuthTransform.js';

const USER_MODULE_SYMBOL = Symbol('User');

/**
 *
 */
export type UserSchema = s.ObjectSchema<{
    /**
     *
     */
    nullable: false;
    /**
     *
     */
    optional: false;
    /**
     *
     */
    props: s.ObjectSchemaProps;
}>;

/**
 *
 */
export interface UserConfig<TSchema extends UserSchema> {
    /**
     *
     */
    name: string;
    /**
     *
     */
    schema: TSchema;
    /**
     *
     */
    authExpiration?: number;
    /**
     *
     */
    refreshExpiration?: number;
}

/**
 *
 */
export interface UserDefinition<TSchema extends UserSchema = UserSchema>
    extends Authorizer,
        Submodule,
        UserConfig<TSchema> {
    /**
     *
     */
    with: (condition: (user: s.Infer<TSchema>) => boolean) => Authorizer;
    /**
     *
     */
    authExpiration: number;
    /**
     *
     */
    refreshExpiration: number;
    /**
     *
     */
    actions: {
        /**
         *
         */
        refresh: ActionDefinition<TSchema, s.ActionSchema, s.Schema<string, object>>;
    };
}

/**
 *
 * @__NO_SIDE_EFFECTS__
 */
export function defineUser<TSchema extends UserSchema>(config: UserConfig<TSchema>) {
    const name = config.name;
    const schema = config.schema;

    return defineSubmodule<UserDefinition<TSchema>>(USER_MODULE_SYMBOL, {
        name,
        schema,
        authExpiration: config.authExpiration ?? 15 * 60 * 1000,
        refreshExpiration: config.refreshExpiration ?? 30 * 24 * 60 * 60 * 1000,
        isAuthorized,
        install(container) {
            container.resolve(AuthRegistry).registerUserType(this);

            return this.actions;
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
                auth: false,
                params: schema,
                result: s.action({ nullable: true }),
                sst: refreshAuthTransform as FunctionDefinition<s.Schema<string, object>, TSchema>,
                defaultHandler: defineInjectable(() => {
                    return () => null;
                }),
            }),
        },
    });

    function isAuthorized(ctx: AuthContext | null): ctx is AuthContext<s.Infer<TSchema>> {
        if (ctx === null) {
            return false;
        }

        if (ctx.type !== name) {
            return false;
        }

        return true;
    }
}
