import { type Resolvable, type ServiceContext, defineService } from '@nzyme/ioc';
import type { ActionDefinition, Module } from '@superadmin/core';
import { MODULE_SYMBOL } from '@superadmin/core/internal';
import type { Schema, SchemaValue } from '@superadmin/schema';

import { ActionHandlerRegistry } from './ActionHandlerRegistry.js';

const ACTION_HANDLER_SYMBOL = Symbol('action-handler');

export interface ActionHandlerFunction<P extends Schema, R extends Schema> {
    (params: SchemaValue<P>, event?: Event): SchemaValue<R> | Promise<SchemaValue<R>>;
}

export interface ActionHandlerOptions<P extends Schema, R extends Schema> {
    action: ActionDefinition<P, R>;
    setup: (ctx: ServiceContext) => ActionHandlerFunction<P, R>;
}

export interface ActionHandler<P extends Schema = Schema, R extends Schema = Schema>
    extends Module {
    action: ActionDefinition<P, R>;
    service: Resolvable<ActionHandlerFunction<P, R>>;
}

export function defineActionHandler<P extends Schema, R extends Schema>(
    options: ActionHandlerOptions<P, R>,
): ActionHandler<P, R> {
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
