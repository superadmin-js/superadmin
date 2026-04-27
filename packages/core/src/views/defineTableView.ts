import type { Simplify } from '@nzyme/types/Common.js';

import * as s from '@superadmin/schema';

import type { ActionButton } from '../actions/ActionButton.js';
import { defineAction } from '../actions/defineAction.js';
import type { Authorizer } from '../auth/defineAuthorizer.js';
import type { ComponentAny } from '../defineComponent.js';
import { defineComponent } from '../defineComponent.js';
import type { Pagination } from '../pagination/definePagination.js';
import { defineView } from './defineView.js';

/** Sort options for a table: true for all columns, or an explicit list of sortable column names. */
export type TableSortOptions<TRow extends s.NonNullable<s.ObjectSchema>> = boolean | RowProps<TRow>;

/** Configuration for defining a table view. */
export interface TableViewOptions<
    TRow extends s.NonNullable<s.ObjectSchema>,
    TParams extends s.SchemaAny,
    TSort extends TableSortOptions<TRow>,
    TPagination extends Pagination | undefined = undefined,
> {
    /** Display title for the table view. */
    title?: string;
    /** Schema describing the shape of each table row. */
    schema: TRow;
    /** Optional schema for the table's filter parameters. */
    filters?: TParams;
    /** URL path for the table view. */
    path?: string;
    /** Authorization rule for accessing this table view. */
    auth?: Authorizer | false;
    /** Factory function returning action buttons for the table header. */
    headerButtons?: (params: s.Infer<TParams>) => ActionButton[];
    /** Factory function returning action buttons for each table row. */
    rowButtons?: (data: s.Infer<TRow>) => ActionButton[];
    /** Columns that can be sorted, or true for all columns. */
    sortColumns?: TSort;
    /** Optional pagination strategy for the table. */
    pagination?: TPagination;
}

/** Type alias for the return type of {@link defineTableView}. */
export type TableView<
    TRow extends s.NonNullable<s.ObjectSchema> = s.NonNullable<s.ObjectSchema>,
    TParams extends s.Schema = s.Schema<unknown>,
    TSort extends TableSortOptions<TRow> = true,
    TPagination extends Pagination | undefined = Pagination | undefined,
> = ReturnType<typeof defineTableView<TRow, TParams, TSort, TPagination>>;

/** Shared component definition for all table views. */
export const tableComponent = defineComponent<TableView['component']>();

type RowProps<TRow extends s.NonNullable<s.ObjectSchema>> = Simplify<(keyof TRow['props'])[]>;

type TableSort<TRow extends s.NonNullable<s.ObjectSchema>, TSort extends TableSortOptions<TRow>> = string[] &
    (TSort extends string[] ? TSort : TSort extends true ? RowProps<TRow> : []);

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

type TablePaginationParams<TPagination extends Pagination | undefined> = TPagination extends Pagination
    ? TPagination['params']
    : s.VoidSchema;

type TablePaginationParamsNullish<TPagination extends Pagination | undefined> = TPagination extends Pagination
    ? s.Nullish<TPagination['params']>
    : s.VoidSchema;

type TablePaginationResult<TPagination extends Pagination | undefined> = TPagination extends Pagination
    ? TPagination['result']
    : s.VoidSchema;

/**
 * Creates a table view with fetch action, sorting, pagination, and row/header button support.
 * @__NO_SIDE_EFFECTS__
 */
export function defineTableView<
    TRow extends s.NonNullable<s.ObjectSchema>,
    TParams extends s.SchemaAny = s.Schema<void>,
    TSort extends TableSortOptions<TRow> = false,
    TPagination extends Pagination | undefined = undefined,
>(config: TableViewOptions<TRow, TParams, TSort, TPagination>) {
    const filters = config.filters ?? (s.void({ nullable: true }) as TParams);
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
        ? (config.pagination.params as TablePaginationParams<TPagination>)
        : (s.void() as TablePaginationParams<TPagination>);

    const paginationParamsNullish: TablePaginationParamsNullish<TPagination> = config.pagination
        ? (s.nullish(config.pagination.params) as TablePaginationParamsNullish<TPagination>)
        : (s.void() as TablePaginationParamsNullish<TPagination>);

    const paginationResult: TablePaginationResult<TPagination> = config.pagination
        ? (config.pagination.result as TablePaginationResult<TPagination>)
        : (s.void() as TablePaginationResult<TPagination>);

    const viewParams = s.object({
        props: {
            filters: filters,
            sort: sortParams,
            pagination: paginationParamsNullish,
        },
    });

    const fetchParams = s.object({
        props: {
            filters: filters,
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
        component,
        params: viewParams,
        path: config.path,
        auth: config.auth,
        title: config.title,
        actions: {
            fetch: defineAction({
                params: fetchParams,
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
