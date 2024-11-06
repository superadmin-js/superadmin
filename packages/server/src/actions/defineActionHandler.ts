import { type Resolvable, type ServiceContext, defineService } from '@nzyme/ioc';
import type { ActionDefinition, Module } from '@superadmin/core';
import { MODULE_SYMBOL } from '@superadmin/core/internal';
import type * as s from '@superadmin/schema';

import { ActionHandlerRegistry } from './ActionHandlerRegistry.js';

const ACTION_HANDLER_SYMBOL = Symbol('action-handler');

export interface ActionHandlerFunction<TParams extends s.Schema, TResult extends s.Schema> {
    (params: s.SchemaValue<TParams>): s.SchemaValue<TResult> | Promise<s.SchemaValue<TResult>>;
}

export interface ActionHandlerOptions<
    TParams extends s.Schema = s.SchemaAny,
    TResult extends s.Schema = s.Schema,
    TInput extends s.Schema = TParams,
> {
    action: ActionDefinition<TParams, TResult, TInput>;
    setup: (ctx: ServiceContext) => ActionHandlerFunction<TParams, TResult>;
}

export interface ActionHandler<
    TParams extends s.Schema = s.SchemaAny,
    TResult extends s.Schema = s.Schema,
    TInput extends s.Schema = TParams,
> extends Module {
    action: ActionDefinition<TParams, TResult, TInput>;
    service: Resolvable<ActionHandlerFunction<TParams, TResult>>;
}

export function defineActionHandler<
    TParams extends s.Schema = s.SchemaAny,
    TResult extends s.Schema = s.Schema,
    TInput extends s.Schema = TParams,
>(
    options: ActionHandlerOptions<TParams, TResult, TInput>,
): ActionHandler<TParams, TResult, TInput> {
    return {
        [MODULE_SYMBOL]: ACTION_HANDLER_SYMBOL,
        action: options.action,
        service: defineService({
            name: options.action.name,
            setup: options.setup,
        }),
        install(container) {
            container.resolve(ActionHandlerRegistry).register(this);
        },
    };
}

export function isActionHandler(value: unknown): value is ActionHandler {
    return (value as ActionHandler | undefined)?.[MODULE_SYMBOL] === ACTION_HANDLER_SYMBOL;
}
