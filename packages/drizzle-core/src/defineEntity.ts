import type { Column, GetColumnData, SQLWrapper, Table } from 'drizzle-orm';

import type { IfLiteral } from '@nzyme/types';
import type { Module, TableView, TableViewOptions } from '@superadmin/core';
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
> = Pick<
    TableViewOptions<EntitySchema<TTable, TColumns>, s.Schema<void>>,
    'path' | 'auth' | 'headerButtons' | 'rowButtons'
> & {
    columns: TColumns;
};

export interface EntityOptions<
    TSchema extends DrizzleSchema = DrizzleSchema,
    TTable extends string & keyof TablesOf<TSchema> = string & keyof TablesOf<TSchema>,
    TColumns extends EntityColumnsOptions<TablesOf<TSchema>[TTable]> = EntityColumnsOptions<
        TablesOf<TSchema>[TTable]
    >,
> {
    name?: string;
    schema: TSchema;
    table: TTable;
    listView: EntityViewOptions<TablesOf<TSchema>[TTable], TColumns>;
}

export interface Entity<
    TSchema extends DrizzleSchema = DrizzleSchema,
    TTable extends string & keyof TablesOf<TSchema> = string & keyof TablesOf<TSchema>,
    TColumns extends EntityColumnsOptions<TablesOf<TSchema>[TTable]> = EntityColumnsOptions<
        TablesOf<TSchema>[TTable]
    >,
> extends Module {
    name: string;
    schema: TSchema;
    table: TablesOf<TSchema>[TTable];
    listView: TableView<EntitySchema<TablesOf<TSchema>[TTable], TColumns>, s.Schema<void>>;
    listViewOptions: EntityViewOptions<TablesOf<TSchema>[TTable], TColumns>;
}

export function defineEntity<
    TSchema extends DrizzleSchema,
    TTable extends string & keyof TablesOf<TSchema>,
    TColumns extends EntityColumnsOptions<TablesOf<TSchema>[TTable]>,
>(options: EntityOptions<TSchema, TTable, TColumns>): Entity<TSchema, TTable, TColumns>;
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
