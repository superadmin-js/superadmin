import { type Resolvable, type ServiceContext, defineService } from '@nzyme/ioc';
import type { Schema, SchemaValue } from '@superadmin/schema';

import type { FunctionDefinition } from './defineFunction.js';
import { MODULE_SYMBOL, type Module } from '../defineModule.js';
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
    extends Module {
    function: FunctionDefinition<P, R>;
    service: Resolvable<FunctionHandlerFunction<P, R>>;
}

export function defineFunctionHandler<P extends Schema, R extends Schema>(
    options: FunctionHandlerOptions<P, R>,
): FunctionHandler<P, R> {
    return {
        [MODULE_SYMBOL]: FUNCTION_HANDLER_SYMBOL,
        function: options.function,
        service: defineService({
            name: options.function.name,
            setup: options.setup,
        }),
        install(container) {
            container.resolve(FunctionRegistry).register(this);
        },
    };
}

export function isFunctionHandler(value: unknown): value is FunctionHandler {
    return (value as FunctionHandler | undefined)?.[MODULE_SYMBOL] === FUNCTION_HANDLER_SYMBOL;
}
