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
            actions.set(action.name, action);
        }

        function resolve(action: string | Action) {
            const name = typeof action === 'string' ? action : action.action;
            return actions.get(name);
        }
    },
});
