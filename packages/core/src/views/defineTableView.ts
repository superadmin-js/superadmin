import type { Simplify } from '@nzyme/types';
import * as s from '@superadmin/schema';

import { defineGenericView } from './defineGenericView.js';
import { defineView } from './defineView.js';
import type { ActionButton } from '../actions/ActionButton.js';
import { defineAction } from '../actions/defineAction.js';
import type { Authorizer } from '../auth/defineAuthorizer.js';

export type TableSortOptions<TRow extends s.NonNullable<s.ObjectSchema>> = boolean | RowProps<TRow>;

export interface TableViewOptions<
    TRow extends s.NonNullable<s.ObjectSchema>,
    TParams extends s.SchemaAny,
    TSort extends TableSortOptions<TRow>,
> {
    name: string;
    schema: TRow;
    params?: TParams;
    path?: string;
    auth?: Authorizer | false;
    headerButtons?: (params: s.SchemaValue<TParams>) => ActionButton[];
    rowButtons?: (data: s.SchemaValue<TRow>) => ActionButton[];
    sortColumns?: TSort;
}

type TableFetchParams<
    TRow extends s.NonNullable<s.ObjectSchema>,
    TParams extends s.Schema,
    TSort extends TableSortOptions<TRow>,
> = s.ObjectSchema<{
    props: {
        params: TParams;
        sort: s.ObjectSchema<{
            nullable: true;
            props: {
                by: s.EnumSchema<{
                    values: TableSort<TRow, TSort>;
                }>;
                direction: s.EnumSchema<{
                    values: ['asc', 'desc'];
                }>;
            };
        }>;
    };
}>;

export type TableView<
    TRow extends s.NonNullable<s.ObjectSchema> = s.NonNullable<s.ObjectSchema>,
    TParams extends s.Schema = s.Schema<unknown>,
    TSort extends TableSortOptions<TRow> = true,
> = ReturnType<typeof defineTableView<TRow, TParams, TSort>>;

export const tableGenericView = defineGenericView({
    name: 'superadmin.table',
});

type RowProps<TRow extends s.NonNullable<s.ObjectSchema>> = Simplify<(keyof TRow['props'])[]>;

type TableSort<
    TRow extends s.NonNullable<s.ObjectSchema>,
    TSort extends TableSortOptions<TRow>,
> = string[] & (TSort extends string[] ? TSort : TSort extends true ? RowProps<TRow> : []);

export function defineTableView<
    TRow extends s.NonNullable<s.ObjectSchema>,
    TParams extends s.SchemaAny = s.Schema<void>,
    TSort extends TableSortOptions<TRow> = false,
>(config: TableViewOptions<TRow, TParams, TSort>) {
    const params = config.params ?? (s.void({ nullable: true }) as TParams);
    const schema = config.schema;

    let sortColumns: TableSort<TRow, TSort>;
    if (config.sortColumns === true) {
        sortColumns = Object.keys(schema.props) as TableSort<TRow, TSort>;
    } else if (Array.isArray(config.sortColumns)) {
        sortColumns = config.sortColumns as TableSort<TRow, TSort>;
    } else {
        sortColumns = [] as TableSort<TRow, TSort>;
    }

    const fetchParams = s.object({
        props: {
            params: params,
            sort: s.object({
                nullable: true,
                optional: true,
                props: {
                    by: s.enum<TableSort<TRow, TSort>>(sortColumns),
                    direction: s.enum(['asc', 'desc']),
                },
            }),
        },
    });

    return defineView({
        name: config.name,
        schema,
        generic: tableGenericView,
        params,
        path: config.path,
        auth: config.auth,
        headerButtons: config.headerButtons,
        rowButtons: config.rowButtons,
        sortColumns,
        actions: {
            fetch: defineAction({
                name: `${config.name}.fetch`,
                params: fetchParams,
                result: s.array({ of: schema }),
                auth: config.auth,
            }),
        },
    });
}
