import { defineService } from '@nzyme/ioc/Service.js';

import type { Schema } from '@superadmin/schema';

import type { FunctionDefinition } from './defineFunction.js';
import type { FunctionHandler } from './defineFunctionHandler.js';

export /**
 *
 */
const FunctionRegistry = defineService({
    name: 'FunctionRegistry',
    setup: () => {
        const handlers = new Map<object, FunctionHandler>();

        return {
            register,
            resolve,
        };

        function register<P extends Schema, R extends Schema>(handler: FunctionHandler<P, R>) {
            handlers.set(handler.function, handler);
        }

        function resolve<P extends Schema, R extends Schema>(definition: FunctionDefinition<P, R>) {
            return handlers.get(definition);
        }
    },
});
