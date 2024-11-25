import type { SomeObject } from '@nzyme/types';
import * as s from '@superadmin/schema';
import { prettifyName } from '@superadmin/utils';

import type { ActionDefinition } from '../actions/defineAction.js';
import type { Module } from '../defineModule.js';
import { defineModule, isModule } from '../defineModule.js';
import { ViewRegistry } from './ViewRegistry.js';
import { type Authorizer, loggedIn, noAuth } from '../auth/defineAuthorizer.js';
import { type Component, defineComponent } from '../components/defineComponent.js';

const VIEW_SYMBOL = Symbol('view');

export type ViewProps<
    TParams extends s.Schema = s.Schema,
    TActions extends Record<string, ActionDefinition> = Record<string, ActionDefinition>,
    TConfig extends Record<string, unknown> = Record<string, unknown>,
> = {
    view: View<TParams, TActions, TConfig>;
    params: s.SchemaValue<TParams>;
};

export type ViewEvents<TParams extends s.Schema = s.Schema> = {
    'update:params': [params: s.SchemaValue<TParams>];
};

export type ViewComponent<
    TParams extends s.Schema = s.Schema,
    TActions extends Record<string, ActionDefinition> = Record<string, ActionDefinition>,
    TConfig extends Record<string, unknown> = Record<string, unknown>,
> = Component<ViewProps<TParams, TActions, TConfig>, ViewEvents<TParams>>;

export interface ViewOptions<
    TParams extends s.Schema,
    TActions extends Record<string, ActionDefinition>,
    TConfig extends Record<string, unknown>,
> {
    name: string;
    title?: string;
    path?: string;
    auth?: Authorizer | false;
    params?: TParams;
    actions?: TActions;
    config?: TConfig;
    navigation?: boolean;
    component?: ViewComponent<TParams, TActions, TConfig>;
}

export interface View<
    TParams extends s.Schema = s.Schema,
    TActions extends Record<string, ActionDefinition> = Record<string, ActionDefinition>,
    TConfig extends Record<string, unknown> = Record<string, unknown>,
> extends Module {
    name: string;
    title: string;
    path: string;
    params: TParams;
    actions: TActions;
    auth: Authorizer;
    navigation: boolean;
    config: TConfig;
    component: ViewComponent<TParams, TActions, TConfig>;
}

export function defineView<
    TParams extends s.Schema = s.VoidSchema,
    TActions extends Record<string, ActionDefinition> = SomeObject,
    TConfig extends Record<string, unknown> = SomeObject,
>(view: ViewOptions<TParams, TActions, TConfig>) {
    return defineModule<View<TParams, TActions, TConfig>>(VIEW_SYMBOL, {
        name: view.name,
        actions: (view.actions ?? {}) as TActions,
        params: (view.params ?? s.void({ nullable: true })) as TParams,
        config: (view.config ?? {}) as TConfig,
        auth: view.auth === false ? noAuth : (view.auth ?? loggedIn),
        navigation: view.navigation ?? true,
        title: view.title || prettifyName(view.name),
        path: view.path ?? `/view/${view.name}`,
        component: view.component ?? defineComponent<ViewComponent<TParams, TActions, TConfig>>(),
        install(container) {
            container.resolve(ViewRegistry).register(this);

            if (view.actions) {
                for (const action of Object.values(view.actions)) {
                    action.install(container);
                }
            }
        },
    });
}

export function isView(value: unknown): value is View {
    return isModule(value, VIEW_SYMBOL);
}
