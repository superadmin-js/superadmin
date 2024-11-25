import type { Simplify } from '@nzyme/types';
import * as s from '@superadmin/schema';

import { defineView } from './defineView.js';
import type { ActionButton } from '../actions/ActionButton.js';
import { defineAction } from '../actions/defineAction.js';
import type { Authorizer } from '../auth/defineAuthorizer.js';
import type { ComponentAny } from '../components/defineComponent.js';
import { defineComponent } from '../components/defineComponent.js';
import type { Pagination } from '../pagination/definePagination.js';

export type TableSortOptions<TRow extends s.NonNullable<s.ObjectSchema>> = boolean | RowProps<TRow>;

export interface TableViewOptions<
    TRow extends s.NonNullable<s.ObjectSchema>,
    TParams extends s.SchemaAny,
    TSort extends TableSortOptions<TRow>,
    TPagination extends Pagination | undefined = undefined,
> {
    name: string;
    schema: TRow;
    params?: TParams;
    path?: string;
    auth?: Authorizer | false;
    headerButtons?: (params: s.SchemaValue<TParams>) => ActionButton[];
    rowButtons?: (data: s.SchemaValue<TRow>) => ActionButton[];
    sortColumns?: TSort;
    pagination?: TPagination;
}

export type TableView<
    TRow extends s.NonNullable<s.ObjectSchema> = s.NonNullable<s.ObjectSchema>,
    TParams extends s.Schema = s.Schema<unknown>,
    TSort extends TableSortOptions<TRow> = true,
    TPagination extends Pagination | undefined = Pagination | undefined,
> = ReturnType<typeof defineTableView<TRow, TParams, TSort, TPagination>>;

export const tableComponent = defineComponent<TableView['component']>();

type RowProps<TRow extends s.NonNullable<s.ObjectSchema>> = Simplify<(keyof TRow['props'])[]>;

type TableSort<
    TRow extends s.NonNullable<s.ObjectSchema>,
    TSort extends TableSortOptions<TRow>,
> = string[] & (TSort extends string[] ? TSort : TSort extends true ? RowProps<TRow> : []);

type TableSortParams<
    TRow extends s.NonNullable<s.ObjectSchema> = s.NonNullable<s.ObjectSchema>,
    TSort extends TableSortOptions<TRow> = TableSortOptions<TRow>,
> = s.ObjectSchema<{
    nullable: true;
    optional: true;
    props: {
        by: s.EnumSchema<{ values: TableSort<TRow, TSort> }>;
        direction: s.EnumSchema<{ values: ['asc', 'desc'] }>;
    };
}>;

type TablePaginationParams<TPagination extends Pagination | undefined> =
    TPagination extends Pagination ? s.Nullish<TPagination['params']> : s.VoidSchema;

type TablePaginationResult<TPagination extends Pagination | undefined> =
    TPagination extends Pagination ? TPagination['result'] : s.VoidSchema;

export function defineTableView<
    TRow extends s.NonNullable<s.ObjectSchema>,
    TParams extends s.SchemaAny = s.Schema<void>,
    TSort extends TableSortOptions<TRow> = false,
    TPagination extends Pagination | undefined = undefined,
>(config: TableViewOptions<TRow, TParams, TSort, TPagination>) {
    const customParams = config.params ?? (s.void({ nullable: true }) as TParams);
    const schema = config.schema;

    let sortColumns: TableSort<TRow, TSort>;
    if (config.sortColumns === true) {
        sortColumns = Object.keys(schema.props) as TableSort<TRow, TSort>;
    } else if (Array.isArray(config.sortColumns)) {
        sortColumns = config.sortColumns as TableSort<TRow, TSort>;
    } else {
        sortColumns = [] as TableSort<TRow, TSort>;
    }

    const sortParams: TableSortParams<TRow, TSort> = s.object({
        nullable: true,
        optional: true,
        props: {
            by: s.enum<TableSort<TRow, TSort>>(sortColumns),
            direction: s.enum(['asc', 'desc']),
        },
    });

    const paginationParams: TablePaginationParams<TPagination> = config.pagination
        ? (s.nullish(config.pagination.params) as TablePaginationParams<TPagination>)
        : (s.void() as TablePaginationParams<TPagination>);

    const paginationResult: TablePaginationResult<TPagination> = config.pagination
        ? (s.nullable(config.pagination.result) as TablePaginationResult<TPagination>)
        : (s.void() as TablePaginationResult<TPagination>);

    const params = s.object({
        props: {
            params: customParams,
            sort: sortParams,
            pagination: paginationParams,
        },
    });

    const fetchResult = s.object({
        props: {
            rows: s.array({ of: schema }),
            pagination: paginationResult,
        },
    });

    const component = tableComponent as ComponentAny;

    return defineView({
        name: config.name,
        component,
        params,
        path: config.path,
        auth: config.auth,
        actions: {
            fetch: defineAction({
                name: `${config.name}.fetch`,
                params: params,
                result: fetchResult,
                auth: config.auth,
            }),
        },
        config: {
            schema,
            headerButtons: config.headerButtons,
            rowButtons: config.rowButtons,
            sortColumns,
            pagination: config.pagination as TPagination,
        },
    });
}
