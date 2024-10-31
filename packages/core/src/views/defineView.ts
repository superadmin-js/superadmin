import type { Schema, SchemaValue } from '@superadmin/schema';
import { prettifyName } from '@superadmin/utils';

import type { ActionDefinition } from '../actions/defineAction.js';
import type { Module } from '../defineModule.js';
import { MODULE_SYMBOL } from '../defineModule.js';
import { ViewRegistry } from './ViewRegistry.js';
import type { GenericView } from './defineGenericView.js';
import { type Authorizer, loggedIn, noAuth } from '../auth/defineAuthorizer.js';

const VIEW_SYMBOL = Symbol('view');

export interface ViewConfig {
    name: string;
    title?: string;
    path?: string;
    generic?: GenericView;
    actions?: Record<string, ActionDefinition>;
    params?: Schema;
    auth?: Authorizer | false;
    navigation?: boolean;
}

export interface View<P extends Schema = Schema> extends Module, ViewConfig {
    [MODULE_SYMBOL]: typeof VIEW_SYMBOL;
    params: P;
    title: string;
    path: string;
    generic?: GenericView;
    auth: Authorizer;
    navigation: boolean;
}

export type ViewParams<TView extends ViewConfig> = TView['params'] extends Schema
    ? SchemaValue<TView['params']>
    : never;

export function defineView<TView extends ViewConfig>(view: TView) {
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

    if (view.auth === false) {
        viewDef.auth = noAuth;
    } else {
        viewDef.auth = view.auth ?? loggedIn;
    }

    viewDef.navigation = view.navigation ?? true;
    viewDef.title = view.title || prettifyName(view.name);
    viewDef.path = view.path ?? `/view/${view.name}`;

    return Object.freeze(viewDef);
}

export function isView(value: unknown): value is View {
    return (value as View | undefined)?.[MODULE_SYMBOL] === VIEW_SYMBOL;
}
