import { type Service, type ServiceContext, defineService } from '@nzyme/ioc';
import * as s from '@superadmin/schema';

import { type Submodule, defineSubmodule, isSubmodule } from '../defineSubmodule.js';
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

type ActionSubmodule<
    TParams extends s.Schema = s.SchemaAny,
    TResult extends s.Schema = s.Schema,
    TInput extends s.Schema = TParams,
> = Submodule & {
    input: TInput;
    params: TParams;
    result: TResult;
    auth: Authorizer;
    handler?: Service<ActionHandler<TInput, TResult>>;
    sst?: FunctionDefinition<TInput, TParams>;
    visit?: (action: s.Action, visitor: ActionVisitor) => void;
};

export type ActionDefinition<
    TParams extends s.Schema = s.SchemaAny,
    TResult extends s.Schema = s.Schema,
    TInput extends s.Schema = TParams,
> = ActionSubmodule<TParams, TResult, TInput> & ActionFactory<TInput, TResult>;

export interface ActionVisitor {
    (action: s.Action): void;
}

export type ActionOf<TDef extends ActionDefinition> = s.Action<TDef['params'], TDef['result']>;

interface ActionOptions<
    TParams extends s.Schema = s.Schema<void>,
    TResult extends s.Schema = s.Schema<void>,
    TInput extends s.Schema = TParams,
> {
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
>(options: ActionOptions<TParams, TResult, TInput>): ActionDefinition<TParams, TResult, TInput>;
export function defineAction<
    TParams extends s.Schema = s.Schema<void>,
    TResult extends s.Schema = s.Schema<void>,
>(options: ActionOptions<TParams, TResult>): ActionDefinition<TParams, TResult>;
export function defineAction(options: ActionOptions): ActionDefinition {
    const factory: ActionFactory = input => {
        return s.coerce(ACTION_SCHEMA, { action: action.id, params: input as unknown });
    };

    const action = factory as ActionDefinition;

    const params = (options.params ?? s.void({ nullable: true })) as s.Schema;
    const result = (options.result ?? s.void({ nullable: true })) as s.Schema;

    const submodule = defineSubmodule<ActionSubmodule>(ACTION_SYMBOL, {
        params,
        result,
        sst: options.sst,
        input: options.sst?.params ?? params,
        auth: options.auth === false ? noAuth : (options.auth ?? loggedIn),
        handler: options.handler ? defineService({ setup: options.handler }) : undefined,
        visit: options.visit as ActionVisitor | undefined,
        install(container) {
            container.resolve(ActionRegistry).register(this as ActionDefinition);
        },
    });

    Object.assign(action, submodule);

    return action;
}

export function isActionDefinition(value: unknown): value is ActionDefinition {
    return isSubmodule(value, ACTION_SYMBOL);
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
