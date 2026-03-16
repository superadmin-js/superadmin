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

/** Props passed to a view component. */
export type ViewProps<
    TParams extends s.Schema = s.Schema,
    TActions extends Record<string, ActionDefinition> = Record<string, ActionDefinition>,
    TConfig extends Record<string, unknown> = Record<string, unknown>,
> = {
    /** Current view parameters (from route or parent). */
    params: s.Infer<TParams>;
    /** The view definition this component is rendering. */
    view: View<TParams, TActions, TConfig>;
};

/** Events emitted by a view component. */
export type ViewEvents<TParams extends s.Schema = s.Schema> = {
    /** Emitted when the view's parameters change. */
    'update:params': [params: s.Infer<TParams>];
};

/** Component type for rendering a view. */
export type ViewComponent<
    TParams extends s.Schema = s.Schema,
    TActions extends Record<string, ActionDefinition> = Record<string, ActionDefinition>,
    TConfig extends Record<string, unknown> = Record<string, unknown>,
> = Component<ViewProps<TParams, TActions, TConfig>, ViewEvents<TParams>>;

/** Configuration for defining a view via {@link defineView}. */
export interface ViewOptions<
    TParams extends s.Schema,
    TActions extends Record<string, ActionDefinition>,
    TConfig extends Record<string, unknown>,
> {
    /** Display title for the view. */
    title?: string;
    /** URL path for the view (auto-generated from ID if not provided). */
    path?: string;
    /** Authorization rule for accessing this view. */
    auth?: Authorizer | false;
    /** Schema for the view's route/query parameters. */
    params?: TParams;
    /** Map of action definitions available within this view. */
    actions?: TActions;
    /** Static configuration data passed to the view component. */
    config?: TConfig;
    /** Whether this view appears in navigation menus (defaults to true). */
    navigation?: boolean;
    /** Component used to render this view. */
    component?: ViewComponent<TParams, TActions, TConfig>;
}

/** A fully resolved view definition registered as a submodule. */
export interface View<
    TParams extends s.Schema = s.Schema,
    TActions extends Record<string, ActionDefinition> = Record<string, ActionDefinition>,
    TConfig extends Record<string, unknown> = Record<string, unknown>,
> extends Submodule {
    /** Display title for the view. */
    title: string;
    /** URL path for the view. */
    path: string;
    /** Schema for the view's route/query parameters. */
    params: TParams;
    /** Map of action definitions available within this view. */
    actions: TActions;
    /** Authorization rule for accessing this view. */
    auth: Authorizer;
    /** Whether this view appears in navigation menus. */
    navigation: boolean;
    /** Static configuration data passed to the view component. */
    config: TConfig;
    /** Component used to render this view. */
    component: ViewComponent<TParams, TActions, TConfig>;
}

/**
 * Creates a view submodule with routing, authorization, actions, and a component.
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

/** Type guard that checks whether a value is a view definition. */
export function isView(value: unknown): value is View {
    return isSubmodule(value, VIEW_SYMBOL);
}
