import * as s from '@superadmin/schema';

import type { ActionDefinition, ActionInput } from './defineAction.js';
const ACTION_SCHEMA = s.action();

/**
 *
 */
export function createAction<TDef extends ActionDefinition>(
    action: TDef,
    input: ActionInput<TDef>,
) {
    return s.coerce(ACTION_SCHEMA, { action: action.id, params: input as unknown });
}
