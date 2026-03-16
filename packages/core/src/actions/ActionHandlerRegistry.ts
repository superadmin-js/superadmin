import { defineService } from '@nzyme/ioc/Service.js';

import type { ActionDefinition } from './defineAction.js';
import type { ActionHandler } from './defineActionHandler.js';

/** Service that stores and resolves action handlers by their action ID. */
export const ActionHandlerRegistry = defineService({
    name: 'ActionHandlerRegistry',
    setup() {
        const handlers = new Map<string, ActionHandler>();

        return {
            register,
            resolve,
        };

        function register(handler: ActionHandler) {
            handlers.set(handler.action.id, handler);
        }

        function resolve(name: string | ActionDefinition) {
            return handlers.get(typeof name === 'string' ? name : name.id);
        }
    },
});
