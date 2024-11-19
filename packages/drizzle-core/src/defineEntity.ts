import type { Column, GetColumnData, SQLWrapper, Table } from 'drizzle-orm';

import type { IfLiteral } from '@nzyme/types';
import type { Module, TableSortOptions, TableView, TableViewOptions } from '@superadmin/core';
import { defineModule, defineTableView } from '@superadmin/core';
import * as s from '@superadmin/schema';

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
    'path' | 'auth' | 'headerButtons' | 'rowButtons' | 'sortColumns'
> & {
    columns: TColumns;
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
    name?: string;
    schema: TSchema;
    table: TTableName;
    listView: EntityViewOptions<TTable, TColumns, TSort>;
}

export interface Entity<
    TSchema extends DrizzleSchema = DrizzleSchema,
    TTable extends Table = Table,
    TColumns extends EntityColumnsOptions<TTable> = EntityColumnsOptions<TTable>,
    TSort extends TableSortOptions<EntitySchema<TTable, TColumns>> = TableSortOptions<
        EntitySchema<TTable, TColumns>
    >,
> extends Module {
    name: string;
    schema: TSchema;
    table: TTable;
    listView: TableView<EntitySchema<TTable, TColumns>, s.Schema<void>, TSort>;
    listViewOptions: EntityViewOptions<TTable, TColumns, TSort>;
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
    const listProps = {} as EntitySchemaProps;
    const table = options.schema[options.table] as Table;
    const name = options.name ?? options.table;

    for (const [key, value] of Object.entries(options.listView.columns)) {
        if (value === true) {
            const column = table[key as keyof typeof table] as Column;
            if (!column) {
                throw new Error(`Column ${key} not found in table ${options.table}`);
            }

            listProps[key] = getColumnSchema(column, {
                nullable: !column.notNull,
                sql: column,
            }) as EntityColumnSchema;
        }
    }

    const listView = defineTableView({
        name: `${name}.list`,
        path: options.listView.path,
        auth: options.listView.auth,
        sortColumns: options.listView.sortColumns ?? true,
        headerButtons: options.listView.headerButtons,
        rowButtons: options.listView.rowButtons,
        schema: s.object({
            props: listProps,
        }),
    });

    return defineModule<Entity>(ENTITY_SYMBOL, {
        install(container) {
            container.resolve(EntityRegistry).register(this as unknown as Entity);
            listView.install(container);
        },
        name,
        schema: options.schema,
        table: options.schema[options.table] as Table,
        listView,
        listViewOptions: options.listView,
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
