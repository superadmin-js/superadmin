import type { Injectable } from '@nzyme/ioc';

import * as s from '@superadmin/schema';
import { prettifyName } from '@superadmin/utils';

import type { Authorizer } from '../auth/defineAuthorizer.js';
import { resolveAuthorizer } from '../auth/defineAuthorizer.js';
import { defineSubmodule, isSubmodule } from '../defineSubmodule.js';
import type { Submodule } from '../defineSubmodule.js';
import type { FunctionDefinition } from '../functions/defineFunction.js';
import { ActionRegistry } from './ActionRegistry.js';
import { AuthContext } from '../auth/AuthContext.js';

/**
 *
 */
export const ACTION_SYMBOL = Symbol('action');

/**
 *
 */
export type ActionDefinition<
    TParams extends s.Schema = s.SchemaAny,
    TResult extends s.Schema = s.Schema,
    TInput extends s.Schema = TParams,
> = ActionFactory<TInput, TResult> & ActionSubmodule<TParams, TResult, TInput>;

/**
 *
 */
export interface ActionVisitor {
    (action: s.Action): void;
}

/**
 *
 */
export type ActionOf<TDef extends ActionDefinition> = s.Action<TDef['params'], TDef['result']>;

/**
 *
 */
export type ActionInput<TDef extends ActionDefinition> = s.Infer<TDef['input']>;

type ActionFactory<TParams extends s.Schema = s.SchemaAny, R extends s.Schema = s.Schema<unknown>> =
    s.Infer<TParams> extends void
        ? () => s.Action<TParams, R>
        : (input: s.Infer<TParams>) => s.Action<TParams, R>;

type ActionHandler<P extends s.Schema, R extends s.Schema> = (
    params: s.Infer<P>,
) => Promise<s.Infer<R>> | s.Infer<R>;

type ActionSubmodule<
    TParams extends s.Schema = s.SchemaAny,
    TResult extends s.Schema = s.Schema,
    TInput extends s.Schema = TParams,
> = Submodule & {
    auth: Authorizer;
    handler?: Injectable<ActionHandler<TInput, TResult>>;
    input: TInput;
    params: TParams;
    result: TResult;
    sst?: FunctionDefinition<TInput, TParams>;
    title: string;
    visit?: (action: s.Action, visitor: ActionVisitor) => void;
};

interface ActionOptions<
    TParams extends s.Schema = s.Schema<void>,
    TResult extends s.Schema = s.Schema<void>,
    TInput extends s.Schema = TParams,
> {
    title?: string;
    params?: TParams;
    result?: TResult;
    auth?: Authorizer | false;
    sst?: FunctionDefinition<TInput, TParams>;
    defaultHandler?: Injectable<ActionHandler<TInput, TResult>>;
    visit?: (action: s.Action<TInput, TResult>, visitor: ActionVisitor) => void;
}
/** */
export function defineAction<
    TParams extends s.Schema = s.Schema<void>,
    TResult extends s.Schema = s.Schema<void>,
    TInput extends s.Schema = TParams,
>(options: ActionOptions<TParams, TResult, TInput>): ActionDefinition<TParams, TResult, TInput>;
/** */
export function defineAction<
    TParams extends s.Schema = s.Schema<void>,
    TResult extends s.Schema = s.Schema<void>,
>(options: ActionOptions<TParams, TResult>): ActionDefinition<TParams, TResult>;
/**
 *
 */
export function defineAction(options: ActionOptions): ActionDefinition {
    const factory: ActionFactory = (input: unknown) => {
        const actionPayload: s.ActionPayload = {
            get action() {
                // Lazy resolution of action id
                return action.id;
            },
            params: input,
        };

        return actionPayload as s.Action;
    };

    const action = factory as ActionDefinition;

    const params = (options.params ?? s.void({ nullable: true })) as s.Schema;
    const result = (options.result ?? s.void({ nullable: true })) as s.Schema;

    const submodule = defineSubmodule<ActionSubmodule>(ACTION_SYMBOL, {
        params,
        result,
        sst: options.sst,
        title: options.title ?? '',
        input: options.sst?.params ?? params,
        auth: resolveAuthorizer(options.auth),
        handler: options.defaultHandler,
        visit: options.visit as ActionVisitor | undefined,
        init(id) {
            if (!this.title) {
                this.title = prettifyName(id, ':');
            }
        },
        install(container) {
            container.resolve(ActionRegistry).register(this as ActionDefinition);
        },
    });

    Object.assign(action, submodule);

    return action;
}

/**
 *
 */
export function isActionDefinition(value: unknown): value is ActionDefinition {
    return isSubmodule(value, ACTION_SYMBOL);
}

/**
 *
 */
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
