import { defineInjectable } from '@nzyme/ioc/Injectable.js';

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

/** Schema constraint for user data: a non-nullable, non-optional object schema. */
export type UserSchema = s.ObjectSchema<{
    /** User schemas must not be nullable. */
    nullable: false;
    /** User schemas must not be optional. */
    optional: false;
    /** The object properties defining the user data shape. */
    props: s.ObjectSchemaProps;
}>;

/** Configuration options for defining a user type. */
export interface UserConfig<TSchema extends UserSchema> {
    /** Unique name identifying this user type (used as discriminant in auth context). */
    name: string;
    /** Schema describing the shape of the user data. */
    schema: TSchema;
    /** Auth token expiration in milliseconds (defaults to 15 minutes). */
    authExpiration?: number;
    /** Refresh token expiration in milliseconds (defaults to 30 days). */
    refreshExpiration?: number;
}

/** Full user type definition that combines authorizer, submodule, and user config capabilities. */
export interface UserDefinition<TSchema extends UserSchema = UserSchema>
    extends Authorizer, Submodule, UserConfig<TSchema> {
    /** Creates a derived authorizer that additionally checks a condition on the user data. */
    with: (condition: (user: s.Infer<TSchema>) => boolean) => Authorizer;
    /** Auth token expiration in milliseconds. */
    authExpiration: number;
    /** Refresh token expiration in milliseconds. */
    refreshExpiration: number;
    /** Built-in actions for this user type. */
    actions: {
        /** Action to refresh authentication using a refresh token. */
        refresh: ActionDefinition<TSchema, s.ActionSchema, s.Schema<string, object>>;
    };
}

/**
 * Defines a user type with its schema, token expiration settings, and built-in refresh action.
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
