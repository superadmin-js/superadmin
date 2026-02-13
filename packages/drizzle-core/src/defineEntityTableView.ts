import type { IfLiteral } from '@nzyme/types/TypeGuards.js';
import type { Column, GetColumnData, SQLWrapper, Table } from 'drizzle-orm';
import { getTableName } from 'drizzle-orm';

import type { Submodule } from '@superadmin/core/defineSubmodule.js';
import type { BasicPagination } from '@superadmin/core/pagination/defineBasicPagination.js';
import { defineBasicPagination } from '@superadmin/core/pagination/defineBasicPagination.js';
import type { TableSortOptions, TableView, TableViewOptions } from '@superadmin/core/views/defineTableView.js';
import { defineSubmodule } from '@superadmin/core/defineSubmodule.js';
import { defineTableView } from '@superadmin/core/views/defineTableView.js';
import * as s from '@superadmin/schema';

import { EntityRegistry } from './EntityRegistry.js';
import type { TableAny } from './types.js';

const ENTITY_SYMBOL = Symbol('entity');

/**
 *
 */
export type EntityColumnsOptions<T extends Table = Table> = {
    [K in keyof T['_']['columns']]?: boolean;
};

/**
 *
 */
export type EntityColumnsOptionsCheck<
    TTable extends Table,
    TColumns extends EntityColumnsOptions<TTable>,
> = EntityColumnsOptions<TTable> & {
    [K in keyof TColumns]: TColumns[K] extends true
        ? K extends keyof TTable['_']['columns']
            ? true
            : never
        : never;
};

/**
 *
 */
export type EntityColumnProps = {
    /**
     *
     */
    sql: SQLWrapper;
};

/**
 *
 */
export type EntityColumnSchema<T = unknown> = EntityColumnProps & s.SchemaOf<T>;

/**
 *
 */
export type EntitySchemaProps = Record<string, EntityColumnSchema>;

/**
 *
 */
export type EntitySchema<
    TTable extends TableAny,
    TColumns extends EntityColumnsOptions<TTable>,
> = IfLiteral<
    keyof TColumns,
    s.ObjectSchema<{
        /**
         *
         */
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
            /**
             *
             */
            props: EntitySchemaProps;
        }>
    >
>;

/**
 *
 */
export type EntityTableViewOptions<
    TTable extends TableAny = Table,
    TColumns extends EntityColumnsOptions<TTable> = EntityColumnsOptions<TTable>,
    TSort extends TableSortOptions<EntitySchema<TTable, TColumns>> = TableSortOptions<
        EntitySchema<TTable, TColumns>
    >,
> = Pick<
    TableViewOptions<EntitySchema<TTable, TColumns>, s.Schema<void>, TSort>,
    'auth' | 'headerButtons' | 'path' | 'rowButtons' | 'sortColumns' | 'title'
> & {
    /**
     *
     */
    columns: EntityColumnsOptionsCheck<TTable, TColumns> & TColumns;
    /**
     *
     */
    pageSizes?: number[];
    /**
     *
     */
    table: TTable;
};

/**
 *
 */
export interface Entity<
    TTable extends TableAny = Table,
    TColumns extends EntityColumnsOptions<TTable> = EntityColumnsOptions<TTable>,
    TSort extends TableSortOptions<EntitySchema<TTable, TColumns>> = TableSortOptions<
        EntitySchema<TTable, TColumns>
    >,
> extends Submodule {
    /**
     *
     */
    table: TTable;
    /**
     *
     */
    tableView: TableView<EntitySchema<TTable, TColumns>, s.Schema<void>, TSort, BasicPagination>;
}

/**
 * @__NO_SIDE_EFFECTS__
 */
export function defineEntityTableView<
    TTable extends TableAny = Table,
    TColumns extends EntityColumnsOptions<TTable> = EntityColumnsOptions<TTable>,
    TSort extends TableSortOptions<EntitySchema<TTable, TColumns>> = true,
>(options: EntityTableViewOptions<TTable, TColumns, TSort>): Entity<TTable, TColumns, TSort>;
/**
 * @__NO_SIDE_EFFECTS__
 */
export function defineEntityTableView(options: EntityTableViewOptions): Entity {
    const tableProps = {} as EntitySchemaProps;
    const table = options.table;

    for (const [key, value] of Object.entries(options.columns)) {
        if (value === true) {
            const column = table[key as keyof typeof table] as Column;
            if (!column) {
                throw new Error(`Column ${key} not found in table "${getTableName(table)}"`);
            }

            tableProps[key] = getColumnSchema(column, {
                nullable: !column.notNull,
                sql: column,
            }) as EntityColumnSchema;
        }
    }

    const tableView = defineTableView({
        title: options.title,
        path: options.path,
        auth: options.auth,
        sortColumns: options.sortColumns ?? true,
        headerButtons: options.headerButtons,
        rowButtons: options.rowButtons,
        schema: s.object({
            props: tableProps,
        }),
        pagination: defineBasicPagination({
            pageSizes: options.pageSizes,
        }),
    });

    return defineSubmodule<Entity>(ENTITY_SYMBOL, {
        install(container) {
            container.resolve(EntityRegistry).register(this as unknown as Entity);

            return {
                tableView,
            };
        },
        table,
        tableView,
    });
}

function getColumnSchema(column: Column, options: EntityColumnProps & s.SchemaOptionsBase) {
    switch (column.dataType) {
        case 'array':
            return s.array(s.unknown(options));
        case 'bigint':
            return s.bigint(options);
        case 'boolean':
            return s.boolean(options);
        case 'date':
            return s.date(options);
        case 'number':
            if (column.columnType === 'integer') {
                return s.integer(options);
            }

            return s.number(options);
        case 'string':
            return s.string(options);
        default:
            return s.unknown(options);
    }
}
