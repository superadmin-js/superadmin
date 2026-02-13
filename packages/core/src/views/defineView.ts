import type { SomeObject } from '@nzyme/types/Object.js';

import * as s from '@superadmin/schema';
import { prettifyName } from '@superadmin/utils/prettifyName.js';

import type { ActionDefinition } from '../actions/defineAction.js';
import { resolveAuthorizer } from '../auth/defineAuthorizer.js';
import type { Authorizer } from '../auth/defineAuthorizer.js';
import { defineComponent } from '../defineComponent.js';
import type { Component } from '../defineComponent.js';
import type { Submodule } from '../defineSubmodule.js';
import { defineSubmodule, isSubmodule } from '../defineSubmodule.js';
import { ViewRegistry } from './ViewRegistry.js';

const VIEW_SYMBOL = Symbol('view');

/**
 *
 */
export type ViewProps<
    TParams extends s.Schema = s.Schema,
    TActions extends Record<string, ActionDefinition> = Record<string, ActionDefinition>,
    TConfig extends Record<string, unknown> = Record<string, unknown>,
> = {
    /**
     *
     */
    params: s.Infer<TParams>;
    /**
     *
     */
    view: View<TParams, TActions, TConfig>;
};

/**
 *
 */
export type ViewEvents<TParams extends s.Schema = s.Schema> = {
    /**
     *
     */
    'update:params': [params: s.Infer<TParams>];
};

/**
 *
 */
export type ViewComponent<
    TParams extends s.Schema = s.Schema,
    TActions extends Record<string, ActionDefinition> = Record<string, ActionDefinition>,
    TConfig extends Record<string, unknown> = Record<string, unknown>,
> = Component<ViewProps<TParams, TActions, TConfig>, ViewEvents<TParams>>;

/**
 *
 */
export interface ViewOptions<
    TParams extends s.Schema,
    TActions extends Record<string, ActionDefinition>,
    TConfig extends Record<string, unknown>,
> {
    /**
     *
     */
    title?: string;
    /**
     *
     */
    path?: string;
    /**
     *
     */
    auth?: Authorizer | false;
    /**
     *
     */
    params?: TParams;
    /**
     *
     */
    actions?: TActions;
    /**
     *
     */
    config?: TConfig;
    /**
     *
     */
    navigation?: boolean;
    /**
     *
     */
    component?: ViewComponent<TParams, TActions, TConfig>;
}

/**
 *
 */
export interface View<
    TParams extends s.Schema = s.Schema,
    TActions extends Record<string, ActionDefinition> = Record<string, ActionDefinition>,
    TConfig extends Record<string, unknown> = Record<string, unknown>,
> extends Submodule {
    /**
     *
     */
    title: string;
    /**
     *
     */
    path: string;
    /**
     *
     */
    params: TParams;
    /**
     *
     */
    actions: TActions;
    /**
     *
     */
    auth: Authorizer;
    /**
     *
     */
    navigation: boolean;
    /**
     *
     */
    config: TConfig;
    /**
     *
     */
    component: ViewComponent<TParams, TActions, TConfig>;
}

/**
 *
 * @__NO_SIDE_EFFECTS__
 */
export function defineView<
    TParams extends s.Schema = s.VoidSchema,
    TActions extends Record<string, ActionDefinition> = SomeObject,
    TConfig extends Record<string, unknown> = SomeObject,
>(view: ViewOptions<TParams, TActions, TConfig>) {
    return defineSubmodule<View<TParams, TActions, TConfig>>(VIEW_SYMBOL, {
        actions: (view.actions ?? {}) as TActions,
        params: (view.params ?? s.void({ nullable: true })) as TParams,
        config: (view.config ?? {}) as TConfig,
        auth: resolveAuthorizer(view.auth),
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

/**
 *
 */
export function isView(value: unknown): value is View {
    return isSubmodule(value, VIEW_SYMBOL);
}
