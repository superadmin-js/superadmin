import { type Resolvable, type ServiceContext, defineService } from '@nzyme/ioc';
import type { Schema, SchemaAny, SchemaValue } from '@superadmin/schema';

import type { ActionDefinition } from './defineAction.js';
import { MODULE_SYMBOL, type Module } from '../defineModule.js';
import { ActionRegistry } from './ActionRegistry.js';

export const ACTION_HANDLER_SYMBOL = Symbol('action-handler');

export interface ActionHandlerFunction<P = unknown, R = unknown> {
    (params: P): R | Promise<R>;
}

export interface ActionHandlerOptions<P extends SchemaAny, R extends SchemaAny> {
    action: ActionDefinition<P, R>;
    setup: (ctx: ServiceContext) => ActionHandlerFunction<SchemaValue<P>, SchemaValue<R>>;
}

export interface ActionHandler<
    P extends SchemaAny = Schema<unknown>,
    R extends SchemaAny = Schema<unknown>,
> extends Module {
    action: ActionDefinition<P, R>;
    service: Resolvable<ActionHandlerFunction<SchemaValue<P>, SchemaValue<R>>>;
}

export function defineActionHandler<P extends SchemaAny, R extends SchemaAny>(
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
            container.resolve(ActionRegistry).registerHandler(this);
        },
    };
}

export function isActionHandler(value: unknown): value is ActionHandler {
    return (value as ActionHandler | undefined)?.[MODULE_SYMBOL] === ACTION_HANDLER_SYMBOL;
}
