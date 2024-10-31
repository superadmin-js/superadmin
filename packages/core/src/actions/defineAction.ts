import { type Resolvable, type ServiceContext, defineService } from '@nzyme/ioc';
import { createNamedFunction } from '@nzyme/utils';
import * as s from '@superadmin/schema';

import type { Module } from '../defineModule.js';
import { MODULE_SYMBOL } from '../defineModule.js';
import { ActionRegistry } from './ActionRegistry.js';
import type { Authorizer } from '../auth/defineAuthorizer.js';
import { loggedIn, noAuth } from '../auth/defineAuthorizer.js';

export const ACTION_SYMBOL = Symbol('action');
const ACTION_SCHEMA = s.action();

type ActionFactory<P extends s.Schema = s.SchemaAny, R extends s.Schema = s.Schema<unknown>> =
    s.SchemaValue<P> extends void
        ? () => s.Action<P, R>
        : (input: s.SchemaValue<P>) => s.Action<P, R>;

type ActionHandler<P extends s.Schema, R extends s.Schema> = (
    params: s.SchemaValue<P>,
) => s.SchemaValue<R> | Promise<s.SchemaValue<R>>;

export type ActionDefinition<
    P extends s.Schema = s.SchemaAny,
    R extends s.Schema = s.Schema,
> = Module &
    ActionFactory<P, R> & {
        [MODULE_SYMBOL]: typeof ACTION_SYMBOL;
        name: string;
        params: P;
        result: R;
        auth: Authorizer;
        handler?: Resolvable<ActionHandler<P, R>>;
        visit?: (action: s.Action, visitor: ActionVisitor) => void;
    };

export interface ActionVisitor {
    (action: s.Action): void;
}

export type ActionOf<TDef extends ActionDefinition> = s.Action<TDef['params'], TDef['result']>;

interface ActionOptions<P extends s.Schema, R extends s.Schema> {
    name: string;
    params?: P;
    result?: R;
    auth?: Authorizer | false;
    handler?: (ctx: ServiceContext) => ActionHandler<P, R>;
    visit?: (action: s.Action<P, R>, visitor: ActionVisitor) => void;
}

export function defineAction<
    P extends s.Schema = s.Schema<void>,
    R extends s.Schema = s.Schema<void>,
>(options: ActionOptions<P, R>): ActionDefinition<P, R> {
    const name = options.name;
    const factory = createNamedFunction<ActionFactory>(name, input => {
        return s.coerce(ACTION_SCHEMA, { action: name, params: input as unknown });
    });

    const action = factory as ActionDefinition<P, R>;

    action[MODULE_SYMBOL] = ACTION_SYMBOL;
    action.params = options.params ?? (s.void({ nullable: true }) as P);
    action.result = options.result ?? (s.void({ nullable: true }) as R);

    if (options.auth === false) {
        action.auth = noAuth;
    } else {
        action.auth = options.auth ?? loggedIn;
    }

    if (options.handler) {
        action.handler = defineService({
            name: name,
            setup: options.handler,
        });
    }

    action.install = function (container) {
        container.resolve(ActionRegistry).register(this);
    };

    return Object.freeze(action);
}

export function isActionDefinition(value: unknown): value is ActionDefinition {
    return (value as ActionDefinition | undefined)?.[MODULE_SYMBOL] === ACTION_SYMBOL;
}

export function isAction<P extends s.Schema, R extends s.Schema>(
    def: ActionDefinition<P, R>,
    action: s.Action,
): action is s.Action<P, R> {
    return def.name === action.action;
}
