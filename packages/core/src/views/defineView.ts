import * as s from '@superadmin/schema';
import { prettifyName } from '@superadmin/utils';

import type { ActionDefinition } from '../actions/defineAction.js';
import type { Module } from '../defineModule.js';
import { defineModule, isModule } from '../defineModule.js';
import { ViewRegistry } from './ViewRegistry.js';
import type { GenericView } from './defineGenericView.js';
import { type Authorizer, loggedIn, noAuth } from '../auth/defineAuthorizer.js';

const VIEW_SYMBOL = Symbol('view');

export interface ViewConfigBase {
    name: string;
    title?: string;
    path?: string;
    auth?: Authorizer | false;
    navigation?: boolean;
    generic?: GenericView;
}

export interface ViewConfig {
    params?: s.Schema;
    actions?: Record<string, ActionDefinition>;
}

export type View<TConfig extends ViewConfig = Required<ViewConfig>> = Module &
    Omit<TConfig, keyof ViewConfig> & {
        name: string;
        title: string;
        path: string;
        params: TConfig['params'] extends s.Schema ? TConfig['params'] : s.Schema<void>;
        actions: TConfig['actions'];
        auth: Authorizer;
        navigation: boolean;
        generic?: GenericView;
    };

export type ViewParams<TView extends ViewConfig> = TView['params'] extends s.Schema
    ? s.SchemaValue<TView['params']>
    : never;

export function defineView<TConfig extends ViewConfig>(view: TConfig & ViewConfigBase) {
    return defineModule<View>(VIEW_SYMBOL, {
        ...view,
        install(container) {
            container.resolve(ViewRegistry).register(this);

            if (view.actions) {
                for (const action of Object.values(view.actions)) {
                    action.install(container);
                }
            }
        },
        actions: view.actions ?? {},
        params: view.params ?? s.void({ nullable: true }),
        auth: view.auth === false ? noAuth : (view.auth ?? loggedIn),
        navigation: view.navigation ?? true,
        title: view.title || prettifyName(view.name),
        path: view.path ?? `/view/${view.name}`,
    }) as View<TConfig>;
}

export function isView(value: unknown): value is View {
    return isModule(value, VIEW_SYMBOL);
}
