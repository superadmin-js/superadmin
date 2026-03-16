import type { SomeObject } from '@nzyme/types/Object.js';

import type * as s from '@superadmin/schema';

import { defineComponent } from '../defineComponent.js';
import type { Component } from '../defineComponent.js';

/** Props passed to a pagination component. */
export type PaginationProps<
    TParams extends s.Schema = s.Schema,
    TResult extends s.Schema = s.Schema,
    TConfig extends Record<string, unknown> = Record<string, unknown>,
> = {
    /** Current pagination parameters (page, page size, etc.). */
    value: s.Infer<TParams>;
    /** The pagination result from the last fetch, or undefined if not yet loaded. */
    result: s.Infer<TResult> | undefined;
    /** Static configuration for the pagination (e.g., page sizes). */
    config: TConfig;
};

/** Events emitted by a pagination component. */
export type PaginationEvents<TParams extends s.Schema = s.Schema> = {
    /** Emitted when the user changes pagination parameters. */
    'update:value': [value: s.Infer<TParams>];
};

/** Component type for rendering pagination controls. */
export type PaginationComponent<
    TParams extends s.Schema = s.Schema,
    TResult extends s.Schema = s.Schema,
    TConfig extends Record<string, unknown> = Record<string, unknown>,
> = Component<PaginationProps<TParams, TResult, TConfig>, PaginationEvents<TParams>>;

/** Configuration for defining a pagination strategy. */
export interface PaginationOptions<
    TParams extends s.Schema,
    TResult extends s.Schema,
    TConfig extends Record<string, unknown>,
> {
    /** Schema for the pagination request parameters. */
    params: TParams;
    /** Schema for the pagination response metadata. */
    result: TResult;
    /** Optional component to use for rendering the pagination controls. */
    component?: PaginationComponent<TParams, TResult, TConfig>;
    /** Optional static configuration passed to the pagination component. */
    config?: TConfig;
}

/** A fully resolved pagination definition with params, result, component, and config. */
export interface Pagination<
    TParams extends s.Schema = s.Schema,
    TResult extends s.Schema = s.Schema,
    TConfig extends Record<string, unknown> = Record<string, unknown>,
> {
    /** Schema for the pagination request parameters. */
    params: TParams;
    /** Schema for the pagination response metadata. */
    result: TResult;
    /** Component used to render the pagination controls. */
    component: PaginationComponent<TParams, TResult, TConfig>;
    /** Static configuration passed to the pagination component. */
    config: TConfig;
}

/** Creates a pagination definition with schemas, an optional component, and optional config. */
export function definePagination<
    TParams extends s.Schema,
    TResult extends s.Schema,
    TConfig extends Record<string, unknown> = SomeObject,
>(options: PaginationOptions<TParams, TResult, TConfig>): Pagination<TParams, TResult, TConfig> {
    return {
        params: options.params,
        result: options.result,
        component: options.component ?? defineComponent(),
        config: (options.config ?? {}) as TConfig,
    };
}
