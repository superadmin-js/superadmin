import type { Column, GetColumnData, Table } from 'drizzle-orm';

import type { Module, TableView } from '@superadmin/core';
import { defineModule, defineTableView } from '@superadmin/core';
import * as s from '@superadmin/schema';

import { EntityRegistry } from './EntityRegistry.js';
import type { DrizzleSchema, TablesOf } from './types.js';

const ENTITY_SYMBOL = Symbol('entity');

export type EntityViewOptions<T extends Table = Table> = {
    path?: string;
    columns: {
        [K in keyof T['_']['columns']]?: boolean;
    };
};

export type EntityViewSchema<
    TTable extends Table,
    TView extends EntityViewOptions<TTable>,
> = s.ObjectSchema<{
    props: {
        [K in keyof TView['columns']]: TView['columns'][K] extends true
            ? K extends keyof TTable['_']['columns']
                ? s.SchemaOf<GetColumnData<TTable['_']['columns'][K]>>
                : never
            : never;
    };
}>;

export interface EntityOptions<
    TSchema extends DrizzleSchema,
    TTable extends string & keyof TablesOf<TSchema>,
    TListView extends EntityViewOptions<TablesOf<TSchema>[TTable]>,
> {
    name?: string;
    schema: TSchema;
    table: TTable;
    listView: TListView;
}

export interface Entity<
    TSchema extends DrizzleSchema = DrizzleSchema,
    TTable extends string & keyof TablesOf<TSchema> = string & keyof TablesOf<TSchema>,
    TListView extends EntityViewOptions<TablesOf<TSchema>[TTable]> = EntityViewOptions<
        TablesOf<TSchema>[TTable]
    >,
> extends Module {
    name: string;
    schema: TSchema;
    table: TTable;
    listView: TableView<EntityViewSchema<TablesOf<TSchema>[TTable], TListView>>;
}

export function defineEntity<
    TSchema extends DrizzleSchema,
    TTable extends string & keyof TablesOf<TSchema>,
    TListView extends EntityViewOptions<TablesOf<TSchema>[TTable]>,
>(options: EntityOptions<TSchema, TTable, TListView>) {
    const listProps = {} as s.ObjectSchemaProps;
    const table = options.schema[options.table] as Table;
    const name = options.name ?? options.table;

    for (const [key, value] of Object.entries(options.listView.columns)) {
        if (value === true) {
            const column = table[key as keyof typeof table] as Column;
            if (!column) {
                throw new Error(`Column ${key} not found in table ${options.table}`);
            }

            listProps[key] = getColumnSchema(column);
        }
    }

    const listView = defineTableView({
        name: `${name}.list`,
        path: options.listView.path,
        schema: s.object({
            props: listProps,
        }),
    }) as TableView<EntityViewSchema<TablesOf<TSchema>[TTable], TListView>>;

    return defineModule<Entity<TSchema, TTable, TListView>>(ENTITY_SYMBOL, {
        install(container) {
            container.resolve(EntityRegistry).register(this as unknown as Entity);
            listView.install(container);
        },
        name,
        schema: options.schema,
        table: options.table,
        listView,
    });
}

function getColumnSchema(column: Column) {
    switch (column.dataType) {
        case 'boolean':
            return s.boolean();
        case 'number':
            if (column.columnType === 'integer') {
                return s.integer();
            }

            return s.number();
        case 'string':
            return s.string();
        case 'date':
            return s.date();
        case 'bigint':
            return s.bigint();
        case 'array':
            return s.array(s.unknown());
        default:
            return s.unknown();
    }
}
