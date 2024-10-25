import type { SchemaAny } from '@nzyme/zchema';

import type { ActionDefinition } from '../actions/defineAction.js';
import type { Module } from '../defineModule.js';
import { MODULE_SYMBOL } from '../defineModule.js';
import { ViewRegistry } from './ViewRegistry.js';
import type { GenericView } from './defineGenericView.js';

export const VIEW_SYMBOL = Symbol('view');

export interface ViewBase {
    name: string;
    path?: string;
    generic?: GenericView;
    actions?: Record<string, ActionDefinition<SchemaAny, SchemaAny>>;
}

export interface View extends Module, ViewBase {
    [MODULE_SYMBOL]: typeof VIEW_SYMBOL;
    generic?: GenericView;
}

export function defineView<TView extends ViewBase>(view: TView) {
    const viewDef = view as View & TView;

    viewDef[MODULE_SYMBOL] = VIEW_SYMBOL;
    viewDef.install = function (container) {
        container.resolve(ViewRegistry).register(this);

        if (view.actions) {
            for (const action of Object.values(view.actions)) {
                action.install(container);
            }
        }
    };

    return Object.freeze(viewDef);
}

export function isView(value: unknown): value is View {
    return (value as View | undefined)?.[MODULE_SYMBOL] === VIEW_SYMBOL;
}
