import { type Service, type ServiceContext, defineService } from '@nzyme/ioc';
import { type ActionDefinition, type Module, defineModule, isModule } from '@superadmin/core';
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
    service: Service<ActionHandlerFunction<TParams, TResult>>;
}

export function defineActionHandler<
    TParams extends s.Schema = s.SchemaAny,
    TResult extends s.Schema = s.Schema,
    TInput extends s.Schema = TParams,
>(options: ActionHandlerOptions<TParams, TResult, TInput>) {
    return defineModule<ActionHandler<TParams, TResult, TInput>>(ACTION_HANDLER_SYMBOL, {
        action: options.action,
        service: defineService({
            name: options.action.name,
            setup: options.setup,
        }),
        install(container) {
            container.resolve(ActionHandlerRegistry).register(this);
        },
    });
}

export function isActionHandler(value: unknown): value is ActionHandler {
    return isModule(value, ACTION_HANDLER_SYMBOL);
}
