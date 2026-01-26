import { defineService } from '@nzyme/ioc';
import type { Service, Dependencies, ServiceSetup } from '@nzyme/ioc';
import type { EmptyObject } from '@nzyme/types';

import type { Infer, Schema } from '@superadmin/schema';

import { defineSubmodule, isSubmodule } from '../defineSubmodule.js';
import type { Submodule } from '../defineSubmodule.js';
import type { FunctionDefinition } from './defineFunction.js';
import { FunctionRegistry } from './FunctionRegistry.js';

const FUNCTION_HANDLER_SYMBOL = Symbol('function-handler');

/**
 *
 */
export interface FunctionHandlerFunction<P extends Schema, R extends Schema> {
    (params: Infer<P>): Infer<R> | Promise<Infer<R>>;
}

/**
 *
 */
export interface FunctionHandlerOptions<
    P extends Schema,
    R extends Schema,
    TDeps extends Dependencies,
> {
    /**
     *
     */
    readonly function: FunctionDefinition<P, R>;
    /**
     *
     */
    readonly deps?: TDeps;
    /**
     *
     */
    readonly setup: ServiceSetup<TDeps, FunctionHandlerFunction<P, R>>;
}

/**
 *
 */
export interface FunctionHandler<
    P extends Schema = Schema,
    R extends Schema = Schema,
> extends Submodule {
    /**
     *
     */
    function: FunctionDefinition<P, R>;
    /**
     *
     */
    service: Service<FunctionHandlerFunction<P, R>>;
}

/**
 * @__NO_SIDE_EFFECTS__
 */
export function defineFunctionHandler<
    P extends Schema,
    R extends Schema,
    TDeps extends Dependencies = EmptyObject,
>(options: FunctionHandlerOptions<P, R, TDeps>) {
    return defineSubmodule<FunctionHandler<P, R>>(FUNCTION_HANDLER_SYMBOL, {
        function: options.function,
        service: defineService({
            name: options.function.name,
            deps: options.deps,
            setup: options.setup,
        }),
        install(container) {
            container.resolve(FunctionRegistry).register(this);
        },
    });
}

/**
 *
 */
export function isFunctionHandler(value: unknown): value is FunctionHandler {
    return isSubmodule(value, FUNCTION_HANDLER_SYMBOL);
}
