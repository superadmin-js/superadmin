import { defineService } from '@nzyme/ioc';
import type { Action } from '@superadmin/schema';

import type { ActionDefinition } from './defineAction.js';

export const ActionRegistry = defineService({
    name: 'ActionRegistry',
    setup() {
        const actions = new Map<string, ActionDefinition>();

        return {
            register,
            resolve,
        };

        function register(action: ActionDefinition) {
            if (actions.has(action.id)) {
                throw new Error(`Action ${action.id} already registered`);
            }

            actions.set(action.id, action);
        }

        function resolve(action: string | Action) {
            const id = typeof action === 'string' ? action : action.action;
            return actions.get(id);
        }
    },
});
