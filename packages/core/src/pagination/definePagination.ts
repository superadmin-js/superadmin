import type { SomeObject } from '@nzyme/types';
import type * as s from '@superadmin/schema';

import { type Component, defineComponent } from '../defineComponent.js';

export type PaginationProps<
    TParams extends s.Schema = s.Schema,
    TResult extends s.Schema = s.Schema,
    TConfig extends Record<string, unknown> = Record<string, unknown>,
> = {
    value: s.Infer<TParams>;
    result: s.Infer<TResult> | undefined;
    config: TConfig;
};

export type PaginationEvents<TParams extends s.Schema = s.Schema> = {
    'update:value': [value: s.Infer<TParams>];
};

export type PaginationComponent<
    TParams extends s.Schema = s.Schema,
    TResult extends s.Schema = s.Schema,
    TConfig extends Record<string, unknown> = Record<string, unknown>,
> = Component<PaginationProps<TParams, TResult, TConfig>, PaginationEvents<TParams>>;

export interface PaginationOptions<
    TParams extends s.Schema,
    TResult extends s.Schema,
    TConfig extends Record<string, unknown>,
> {
    params: TParams;
    result: TResult;
    component?: PaginationComponent<TParams, TResult, TConfig>;
    config?: TConfig;
}

export interface Pagination<
    TParams extends s.Schema = s.Schema,
    TResult extends s.Schema = s.Schema,
    TConfig extends Record<string, unknown> = Record<string, unknown>,
> {
    params: TParams;
    result: TResult;
    component: PaginationComponent<TParams, TResult, TConfig>;
    config: TConfig;
}

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
