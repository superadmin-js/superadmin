import type { Column, GetColumnData, SQLWrapper, Table } from 'drizzle-orm';

import type { IfLiteral } from '@nzyme/types';
import type {
    BasicPagination,
    Submodule,
    TableSortOptions,
    TableView,
    TableViewOptions,
} from '@superadmin/core';
import { defineBasicPagination, defineSubmodule, defineTableView } from '@superadmin/core';
import * as s from '@superadmin/schema';
import { prettifyName } from '@superadmin/utils';

import { EntityRegistry } from './EntityRegistry.js';
import type { DrizzleSchema, TablesOf } from './types.js';

const ENTITY_SYMBOL = Symbol('entity');

export type EntityColumnsOptions<T extends Table = Table> = {
    [K in keyof T['_']['columns']]?: boolean;
};

export type EntityColumnProps = {
    sql: SQLWrapper;
};

export type EntityColumnSchema<T = unknown> = s.SchemaOf<T> & EntityColumnProps;

export type EntitySchemaProps = Record<string, EntityColumnSchema>;

export type EntitySchema<
    TTable extends Table,
    TColumns extends EntityColumnsOptions<TTable>,
> = IfLiteral<
    keyof TColumns,
    s.ObjectSchema<{
        props: {
            [K in keyof TColumns]: TColumns[K] extends true
                ? K extends keyof TTable['_']['columns']
                    ? s.SchemaOf<GetColumnData<TTable['_']['columns'][K]>>
                    : never
                : never;
        };
    }>,
    s.NonNullable<
        s.ObjectSchema<{
            props: EntitySchemaProps;
        }>
    >
>;

export type EntityViewOptions<
    TTable extends Table = Table,
    TColumns extends EntityColumnsOptions<TTable> = EntityColumnsOptions<TTable>,
    TSort extends TableSortOptions<EntitySchema<TTable, TColumns>> = false,
> = Pick<
    TableViewOptions<EntitySchema<TTable, TColumns>, s.Schema<void>, TSort>,
    'title' | 'path' | 'auth' | 'headerButtons' | 'rowButtons' | 'sortColumns'
> & {
    columns: TColumns;
    pageSizes?: number[];
};

export interface EntityOptions<
    TSchema extends DrizzleSchema = DrizzleSchema,
    TTableName extends string & keyof TablesOf<TSchema> = string & keyof TablesOf<TSchema>,
    TTable extends TablesOf<TSchema>[TTableName] = TablesOf<TSchema>[TTableName],
    TColumns extends EntityColumnsOptions<TTable> = EntityColumnsOptions<TTable>,
    TSort extends TableSortOptions<EntitySchema<TTable, TColumns>> = TableSortOptions<
        EntitySchema<TTable, TColumns>
    >,
> {
    schema: TSchema;
    table: TTableName;
    tableView: EntityViewOptions<TTable, TColumns, TSort>;
}

export interface Entity<
    TSchema extends DrizzleSchema = DrizzleSchema,
    TTable extends Table = Table,
    TColumns extends EntityColumnsOptions<TTable> = EntityColumnsOptions<TTable>,
    TSort extends TableSortOptions<EntitySchema<TTable, TColumns>> = TableSortOptions<
        EntitySchema<TTable, TColumns>
    >,
> extends Submodule {
    schema: TSchema;
    table: TTable;
    tableView: TableView<EntitySchema<TTable, TColumns>, s.Schema<void>, TSort, BasicPagination>;
}

export function defineEntity<
    TSchema extends DrizzleSchema,
    TTableName extends string & keyof TablesOf<TSchema>,
    TTable extends TablesOf<TSchema>[TTableName] = TablesOf<TSchema>[TTableName],
    TColumns extends EntityColumnsOptions<TTable> = EntityColumnsOptions<TTable>,
    TSort extends TableSortOptions<EntitySchema<TTable, TColumns>> = true,
>(
    options: EntityOptions<TSchema, TTableName, TTable, TColumns, TSort>,
): Entity<TSchema, TTable, TColumns, TSort>;
export function defineEntity(options: EntityOptions): Entity {
    const tableProps = {} as EntitySchemaProps;
    const table = options.schema[options.table] as Table;

    const tableViewOptions = options.tableView;
    for (const [key, value] of Object.entries(tableViewOptions.columns)) {
        if (value === true) {
            const column = table[key as keyof typeof table] as Column;
            if (!column) {
                throw new Error(`Column ${key} not found in table ${options.table}`);
            }

            tableProps[key] = getColumnSchema(column, {
                nullable: !column.notNull,
                sql: column,
            }) as EntityColumnSchema;
        }
    }

    const tableView = defineTableView({
        title: tableViewOptions.title ?? prettifyName(options.table),
        path: tableViewOptions.path,
        auth: tableViewOptions.auth,
        sortColumns: tableViewOptions.sortColumns ?? true,
        headerButtons: tableViewOptions.headerButtons,
        rowButtons: tableViewOptions.rowButtons,
        schema: s.object({
            props: tableProps,
        }),
        pagination: defineBasicPagination({
            pageSizes: tableViewOptions.pageSizes,
        }),
    });

    return defineSubmodule<Entity>(ENTITY_SYMBOL, {
        install(container) {
            container.resolve(EntityRegistry).register(this as unknown as Entity);

            return {
                tableView,
            };
        },
        schema: options.schema,
        table: options.schema[options.table] as Table,
        tableView,
    });
}

function getColumnSchema(column: Column, options: s.SchemaOptionsBase & EntityColumnProps) {
    switch (column.dataType) {
        case 'boolean':
            return s.boolean(options);
        case 'number':
            if (column.columnType === 'integer') {
                return s.integer(options);
            }

            return s.number(options);
        case 'string':
            return s.string(options);
        case 'date':
            return s.date(options);
        case 'bigint':
            return s.bigint(options);
        case 'array':
            return s.array(s.unknown(options));
        default:
            return s.unknown(options);
    }
}
