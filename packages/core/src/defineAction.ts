import { createNamedFunction } from '@nzyme/utils';
import type { Schema, SchemaAny, SchemaValue } from '@nzyme/zchema';
import * as z from '@nzyme/zchema';

import type { Module } from './defineModule.js';
import { MODULE_SYMBOL } from './defineModule.js';

export const ACTION_SYMBOL = Symbol('action');

export interface Action<P> {
    name: string;
    params: P;
}

interface ActionFactory<TIn> {
    (input: TIn): Action<TIn>;
}

export interface ActionDefinition<
    P extends SchemaAny = Schema<unknown>,
    R extends SchemaAny = Schema<unknown>,
> extends Module,
        ActionFactory<SchemaValue<P>> {
    [MODULE_SYMBOL]: typeof ACTION_SYMBOL;
    name: string;
    params: P;
    result: R;
}

interface ActionOptions<TIn extends SchemaAny, TOut extends SchemaAny> {
    name: string;
    input?: TIn;
    output?: TOut;
}

export function defineAction<
    P extends SchemaAny = Schema<void>,
    R extends SchemaAny = Schema<void>,
>(options: ActionOptions<P, R>): ActionDefinition<P, R> {
    const name = options.name;
    const factory = createNamedFunction<ActionFactory<SchemaValue<P>>>(name, input => {
        return { name, params: input };
    });

    const action = factory as ActionDefinition<P, R>;

    action[MODULE_SYMBOL] = ACTION_SYMBOL;
    action.params = options.input ?? (z.void() as P);
    action.result = options.output ?? (z.void() as R);
    action.install = function (container) {
        console.log(this.name, this.params, this.result);
    };

    return Object.freeze(action);
}

export function isActionDefinition(value: unknown): value is ActionDefinition {
    return (value as ActionDefinition | undefined)?.[MODULE_SYMBOL] === ACTION_SYMBOL;
}
