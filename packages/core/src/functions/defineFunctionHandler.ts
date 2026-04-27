import { defineService } from '@nzyme/ioc/Service.js';
import type { Dependencies, Service, ServiceSetup } from '@nzyme/ioc/Service.js';
import type { EmptyObject } from '@nzyme/types/EmptyObject.js';

import type { Infer, Schema } from '@superadmin/schema';

import { defineSubmodule, isSubmodule } from '../defineSubmodule.js';
import type { Submodule } from '../defineSubmodule.js';
import type { FunctionDefinition } from './defineFunction.js';
import { FunctionRegistry } from './FunctionRegistry.js';

const FUNCTION_HANDLER_SYMBOL = Symbol('function-handler');

/** Callable signature for a function handler that transforms params into a result. */
export interface FunctionHandlerFunction<P extends Schema, R extends Schema> {
    (params: Infer<P>): Infer<R> | Promise<Infer<R>>;
}

/** Configuration for defining a function handler via {@link defineFunctionHandler}. */
export interface FunctionHandlerOptions<P extends Schema, R extends Schema, TDeps extends Dependencies> {
    /** The function definition this handler implements. */
    readonly function: FunctionDefinition<P, R>;
    /** Optional dependencies required by this function handler. */
    readonly deps?: TDeps;
    /** Factory function that creates the handler, receiving resolved dependencies. */
    readonly setup: ServiceSetup<TDeps, FunctionHandlerFunction<P, R>>;
}

/** Registered function handler linking a function definition to its service implementation. */
export interface FunctionHandler<P extends Schema = Schema, R extends Schema = Schema> extends Submodule {
    /** The function definition this handler is registered for. */
    function: FunctionDefinition<P, R>;
    /** The service that provides the handler function. */
    service: Service<FunctionHandlerFunction<P, R>>;
}

/**
 * Creates a function handler submodule that binds a handler to a function definition.
 * @__NO_SIDE_EFFECTS__
 */
export function defineFunctionHandler<P extends Schema, R extends Schema, TDeps extends Dependencies = EmptyObject>(
    options: FunctionHandlerOptions<P, R, TDeps>,
) {
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

/** Type guard that checks whether a value is a function handler. */
export function isFunctionHandler(value: unknown): value is FunctionHandler {
    return isSubmodule(value, FUNCTION_HANDLER_SYMBOL);
}
