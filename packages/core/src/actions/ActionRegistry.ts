import { defineService } from '@nzyme/ioc';

import type { ActionDefinition } from './defineAction.js';
import type { ActionHandler } from './defineActionHandler.js';
import { Action } from '@superadmin/schema';

export const ActionRegistry = defineService({
    name: 'ActionRegistry',
    setup() {
        const actionsPerName = new Map<string, ActionDefinition>();
        const handlersPerName = new Map<string, ActionHandler>();

        return {
            registerAction,
            registerHandler,
            resolveAction,
            resolveHandler,
        };

        function registerAction(action: ActionDefinition) {
            actionsPerName.set(action.name, action);
        }

        function registerHandler(handler: ActionHandler) {
            handlersPerName.set(handler.action.name, handler);
        }

        function resolveAction(action: string | Action) {
            const name = typeof action === 'string' ? action : action.action;
            return actionsPerName.get(name);
        }

        function resolveHandler(name: string) {
            return handlersPerName.get(name);
        }
    },
});
