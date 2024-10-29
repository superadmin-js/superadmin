import { type Resolvable, type ServiceContext, defineService } from '@nzyme/ioc';
import { createNamedFunction } from '@nzyme/utils';
import * as s from '@superadmin/schema';
import { prettifyName } from '@superadmin/utils';

import type { Module } from '../defineModule.js';
import { MODULE_SYMBOL } from '../defineModule.js';
import { ActionRegistry } from './ActionRegistry.js';
import type { ActionHandlerFunction } from './defineActionHandler.js';

export const ACTION_SYMBOL = Symbol('action');
const ACTION_SCHEMA = s.action();

type ActionFactory<P extends s.Schema = s.SchemaAny, R extends s.Schema = s.Schema<unknown>> =
    s.SchemaValue<P> extends void
        ? () => s.Action<P, R>
        : (input: s.SchemaValue<P>) => s.Action<P, R>;

export type ActionDefinition<
    P extends s.Schema = s.SchemaAny,
    R extends s.Schema = s.Schema<unknown>,
> = Module &
    ActionFactory<P, R> & {
        [MODULE_SYMBOL]: typeof ACTION_SYMBOL;
        name: string;
        params: P;
        result: R;
        label: string;
        icon?: string;
        handler?: Resolvable<ActionHandlerFunction<P, R>>;
    };

interface ActionOptions<P extends s.Schema, R extends s.SchemaAny> {
    name: string;
    label?: string;
    icon?: string;
    params?: P;
    result?: R;
    handler?: (ctx: ServiceContext) => ActionHandlerFunction<P, R>;
}

export function defineAction<
    P extends s.Schema = s.Schema<void>,
    R extends s.Schema = s.Schema<void>,
>(options: ActionOptions<P, R>): ActionDefinition<P, R> {
    const name = options.name;
    const factory = createNamedFunction<ActionFactory>(name, input => {
        return s.coerce(ACTION_SCHEMA, { action: name, params: input as unknown });
    });

    const action = factory as ActionDefinition<P, R>;

    action[MODULE_SYMBOL] = ACTION_SYMBOL;
    action.params = options.params ?? (s.void() as P);
    action.result = options.result ?? (s.void() as R);
    action.label = options.label ?? prettifyName(name);
    action.icon = options.icon;

    if (options.handler) {
        action.handler = defineService({
            name: name,
            setup: options.handler,
        });
    }

    action.install = function (container) {
        container.resolve(ActionRegistry).registerAction(this);
    };

    return Object.freeze(action);
}

export function isActionDefinition(value: unknown): value is ActionDefinition {
    return (value as ActionDefinition | undefined)?.[MODULE_SYMBOL] === ACTION_SYMBOL;
}
