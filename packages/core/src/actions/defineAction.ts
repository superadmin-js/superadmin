import { createNamedFunction } from '@nzyme/utils';
import * as s from '@superadmin/schema';

import type { Module } from '../defineModule.js';
import { MODULE_SYMBOL } from '../defineModule.js';
import { ActionRegistry } from './ActionRegistry.js';
import { prettifyName } from '@superadmin/utils';

export const ACTION_SYMBOL = Symbol('action');

export interface Action<
    P extends s.SchemaAny = s.Schema<unknown>,
    R extends s.SchemaAny = s.Schema<unknown>,
> {
    action: ActionDefinition<P, R>;
    params: s.SchemaValue<P>;
}

type ActionFactory<
    P extends s.SchemaAny = s.Schema<unknown>,
    R extends s.SchemaAny = s.Schema<unknown>,
> = P extends s.Schema<void> ? () => Action<P, R> : (input: s.SchemaValue<P>) => Action<P, R>;

export type ActionDefinition<
    P extends s.SchemaAny = s.Schema<unknown>,
    R extends s.SchemaAny = s.Schema<unknown>,
> = Module &
    ActionFactory<P, R> & {
        [MODULE_SYMBOL]: typeof ACTION_SYMBOL;
        name: string;
        params: P;
        result: R;
        label: string;
        icon?: string;
    };

interface ActionOptions<P extends s.SchemaAny, R extends s.SchemaAny> {
    name: string;
    label?: string;
    icon?: string;
    params?: P;
    result?: R;
}

export function defineAction<
    P extends s.SchemaAny = s.Schema<void>,
    R extends s.SchemaAny = s.Schema<void>,
>(options: ActionOptions<P, R>): ActionDefinition<P, R> {
    const name = options.name;
    const factory = createNamedFunction<ActionFactory>(name, input => {
        return { action, params: input };
    });

    const action = factory as ActionDefinition<P, R>;

    action[MODULE_SYMBOL] = ACTION_SYMBOL;
    action.params = options.params ?? (s.void() as P);
    action.result = options.result ?? (s.void() as R);
    action.label = options.label ?? prettifyName(name);
    action.icon = options.icon;
    action.install = function (container) {
        container.resolve(ActionRegistry).registerAction(this);
    };

    return Object.freeze(action);
}

export function isActionDefinition(value: unknown): value is ActionDefinition {
    return (value as ActionDefinition | undefined)?.[MODULE_SYMBOL] === ACTION_SYMBOL;
}
