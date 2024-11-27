import type { SomeObject } from '@nzyme/types';
import * as s from '@superadmin/schema';
import { prettifyName } from '@superadmin/utils';

import type { ActionDefinition } from '../actions/defineAction.js';
import type { Submodule } from '../defineSubmodule.js';
import { defineSubmodule, isSubmodule } from '../defineSubmodule.js';
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
> extends Submodule {
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
    return defineSubmodule<View<TParams, TActions, TConfig>>(VIEW_SYMBOL, {
        actions: (view.actions ?? {}) as TActions,
        params: (view.params ?? s.void({ nullable: true })) as TParams,
        config: (view.config ?? {}) as TConfig,
        auth: view.auth === false ? noAuth : (view.auth ?? loggedIn),
        navigation: view.navigation ?? true,
        title: view.title || '',
        path: view.path ?? '',
        component: view.component ?? defineComponent<ViewComponent<TParams, TActions, TConfig>>(),
        init(id) {
            if (!this.path) {
                this.path = `/view/${id}`;
            }

            if (!this.title) {
                this.title = prettifyName(id, ':');
            }

            return this.actions;
        },

        install(container) {
            container.resolve(ViewRegistry).register(this);
        },
    });
}

export function isView(value: unknown): value is View {
    return isSubmodule(value, VIEW_SYMBOL);
}
