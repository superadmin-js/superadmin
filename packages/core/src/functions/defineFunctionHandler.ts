import { type Service, type ServiceContext, defineService } from '@nzyme/ioc';
import type { Schema, SchemaValue } from '@superadmin/schema';

import type { FunctionDefinition } from './defineFunction.js';
import { type Submodule, defineSubmodule, isSubmodule } from '../defineSubmodule.js';
import { FunctionRegistry } from './FunctionRegistry.js';

const FUNCTION_HANDLER_SYMBOL = Symbol('function-handler');

export interface FunctionHandlerFunction<P extends Schema, R extends Schema> {
    (params: SchemaValue<P>): SchemaValue<R> | Promise<SchemaValue<R>>;
}

export interface FunctionHandlerOptions<P extends Schema, R extends Schema> {
    function: FunctionDefinition<P, R>;
    setup: (ctx: ServiceContext) => FunctionHandlerFunction<P, R>;
}

export interface FunctionHandler<P extends Schema = Schema, R extends Schema = Schema>
    extends Submodule {
    function: FunctionDefinition<P, R>;
    service: Service<FunctionHandlerFunction<P, R>>;
}

export function defineFunctionHandler<P extends Schema, R extends Schema>(
    options: FunctionHandlerOptions<P, R>,
) {
    return defineSubmodule<FunctionHandler<P, R>>(FUNCTION_HANDLER_SYMBOL, {
        function: options.function,
        service: defineService({
            setup: options.setup,
        }),
        install(container) {
            container.resolve(FunctionRegistry).register(this);
        },
    });
}

export function isFunctionHandler(value: unknown): value is FunctionHandler {
    return isSubmodule(value, FUNCTION_HANDLER_SYMBOL);
}
