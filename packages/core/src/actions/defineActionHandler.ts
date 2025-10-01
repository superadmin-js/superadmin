import { defineService } from '@nzyme/ioc';
import type { Dependencies, Service, ServiceSetup } from '@nzyme/ioc';
import type { HttpRequest } from '@nzyme/rpc';
import type { EmptyObject } from '@nzyme/types';

import type * as s from '@superadmin/schema';

import type { Submodule } from '../defineSubmodule.js';
import { defineSubmodule, isSubmodule } from '../defineSubmodule.js';
import { ActionHandlerRegistry } from './ActionHandlerRegistry.js';
import type { ActionDefinition } from './defineAction.js';

const ACTION_HANDLER_SYMBOL = Symbol('action-handler');

/**
 *
 */
export interface ActionHandlerContext<TResult extends s.Schema> {
    /**
     * Event that triggered the action handler.
     * Only available in client runtime.
     */
    event?: Event;

    /**
     * Request object that triggered the action handler.
     * Only available in server runtime.
     */
    request?: HttpRequest;

    /**
     * Helper function to set the result of the action handler.
     */
    result: (result: s.Infer<TResult>) => s.Infer<TResult>;
}

/**
 *
 */
export interface ActionHandlerFunction<TParams extends s.Schema, TResult extends s.Schema> {
    (
        params: s.Infer<TParams>,
        ctx: ActionHandlerContext<TResult>,
    ): Promise<s.Infer<TResult>> | s.Infer<TResult>;
}

/**
 *
 */
export interface ActionHandlerOptions<
    TParams extends s.Schema,
    TResult extends s.Schema,
    TInput extends s.Schema,
    TDeps extends Dependencies,
> {
    /**
     *
     */
    readonly action: ActionDefinition<TParams, TResult, TInput>;
    /**
     * Optional dependencies required by this action handler.
     */
    readonly deps?: TDeps;
    /**
     *
     */
    readonly setup: ServiceSetup<TDeps, ActionHandlerFunction<TParams, TResult>>;
}

/**
 *
 */
export interface ActionHandler<
    TParams extends s.Schema = s.SchemaAny,
    TResult extends s.Schema = s.Schema,
    TInput extends s.Schema = TParams,
> extends Submodule {
    /**
     *
     */
    action: ActionDefinition<TParams, TResult, TInput>;
    /**
     *
     */
    service: Service<ActionHandlerFunction<TParams, TResult>>;
}

/**
 * @__NO_SIDE_EFFECTS__
 */
export function defineActionHandler<
    TParams extends s.Schema = s.SchemaAny,
    TResult extends s.Schema = s.Schema,
    TInput extends s.Schema = TParams,
    TDeps extends Dependencies = EmptyObject,
>(options: ActionHandlerOptions<TParams, TResult, TInput, TDeps>) {
    return defineSubmodule<ActionHandler<TParams, TResult, TInput>>(ACTION_HANDLER_SYMBOL, {
        action: options.action,
        service: defineService({
            name: options.action.name,
            deps: options.deps,
            setup: options.setup,
        }),
        install(container) {
            container.resolve(ActionHandlerRegistry).register(this);
        },
    });
}

/**
 *
 */
export function isActionHandler(value: unknown): value is ActionHandler {
    return isSubmodule(value, ACTION_HANDLER_SYMBOL);
}
