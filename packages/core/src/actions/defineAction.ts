import { type Resolvable, type ServiceContext, defineService } from '@nzyme/ioc';
import { createNamedFunction } from '@nzyme/utils';
import * as s from '@superadmin/schema';

import type { Module } from '../defineModule.js';
import { MODULE_SYMBOL } from '../defineModule.js';
import { ActionRegistry } from './ActionRegistry.js';
import type { Authorizer } from '../auth/defineAuthorizer.js';
import { loggedIn, noAuth } from '../auth/defineAuthorizer.js';
import type { FunctionDefinition } from '../functions/defineFunction.js';

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
    TParams extends s.Schema = s.SchemaAny,
    TResult extends s.Schema = s.Schema,
    TInput extends s.Schema = TParams,
> = Module &
    ActionFactory<TInput, TResult> & {
        [MODULE_SYMBOL]: typeof ACTION_SYMBOL;
        name: string;
        input: TInput;
        params: TParams;
        result: TResult;
        auth: Authorizer;
        handler?: Resolvable<ActionHandler<TInput, TResult>>;
        sst?: FunctionDefinition<TInput, TParams>;
        visit?: (action: s.Action, visitor: ActionVisitor) => void;
    };

export interface ActionVisitor {
    (action: s.Action): void;
}

export type ActionOf<TDef extends ActionDefinition> = s.Action<TDef['params'], TDef['result']>;

interface ActionOptions<
    TParams extends s.Schema,
    TResult extends s.Schema,
    TInput extends s.Schema,
> {
    name: string;
    params?: TParams;
    result?: TResult;
    auth?: Authorizer | false;
    sst?: FunctionDefinition<TInput, TParams>;
    handler?: (ctx: ServiceContext) => ActionHandler<TInput, TResult>;
    visit?: (action: s.Action<TInput, TResult>, visitor: ActionVisitor) => void;
}

export function defineAction<
    TParams extends s.Schema = s.Schema<void>,
    TResult extends s.Schema = s.Schema<void>,
    TInput extends s.Schema = TParams,
>(options: ActionOptions<TParams, TResult, TInput>): ActionDefinition<TParams, TResult, TInput> {
    const name = options.name;
    const factory = createNamedFunction<ActionFactory>(name, input => {
        return s.coerce(ACTION_SCHEMA, { action: name, params: input as unknown });
    });

    const action = factory as ActionDefinition<TParams, TResult, TInput>;

    action[MODULE_SYMBOL] = ACTION_SYMBOL;
    action.params = options.params ?? (s.void({ nullable: true }) as TParams);
    action.sst = options.sst;
    action.input = options.sst?.params ?? (action.params as unknown as TInput);
    action.result = options.result ?? (s.void({ nullable: true }) as TResult);

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

export function isAction<
    TInput extends s.Schema,
    TParams extends s.Schema,
    TResult extends s.Schema,
>(
    def: ActionDefinition<TInput, TParams, TResult>,
    action: s.Action,
): action is s.Action<TInput, TResult> {
    return def.name === action.action;
}
