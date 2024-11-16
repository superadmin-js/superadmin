import * as s from '@superadmin/schema';
import { prettifyName } from '@superadmin/utils';

import type { ActionDefinition } from '../actions/defineAction.js';
import type { Module } from '../defineModule.js';
import { defineModule, isModule } from '../defineModule.js';
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
    params?: s.Schema;
    auth?: Authorizer | false;
    navigation?: boolean;
}

export interface View<P extends s.Schema = s.Schema> extends Module, ViewConfig {
    params: P;
    title: string;
    path: string;
    generic?: GenericView;
    auth: Authorizer;
    navigation: boolean;
}

export type ViewParams<TView extends ViewConfig> = TView['params'] extends s.Schema
    ? s.SchemaValue<TView['params']>
    : never;

export function defineView<TView extends ViewConfig>(view: TView) {
    return defineModule<View>(VIEW_SYMBOL, {
        install(container) {
            container.resolve(ViewRegistry).register(this);

            if (view.actions) {
                for (const action of Object.values(view.actions)) {
                    action.install(container);
                }
            }
        },
        ...view,
        params: view.params ?? s.void({ nullable: true }),
        auth: view.auth === false ? noAuth : (view.auth ?? loggedIn),
        navigation: view.navigation ?? true,
        title: view.title || prettifyName(view.name),
        path: view.path ?? `/view/${view.name}`,
    }) as View & TView;
}

export function isView(value: unknown): value is View {
    return isModule(value, VIEW_SYMBOL);
}
