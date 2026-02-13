import type { SQL, SQLWrapper, Table } from 'drizzle-orm';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import type { SelectedFields } from 'drizzle-orm/sqlite-core';

import type { DrizzleClient } from '@superadmin/drizzle-core/DrizzleClient.js';
import type { DrizzleSchema } from '@superadmin/drizzle-core/types.js';

interface QueryParams {
    drizzle: DrizzleClient;
    table: Table;
    columns: Record<string, SQLWrapper>;
    sort?: SQL;
    where?: SQL;
    limit?: number;
    offset?: number;
}

/**
 * Executes a query on the database.
 */
export function queryDrizzle(params: QueryParams) {
    const drizzle = params.drizzle as LibSQLDatabase<DrizzleSchema>;
    const columns = params.columns as SelectedFields;

    let query = drizzle.select(columns).from(params.table).where(params.where);

    if (params.limit) {
        query = query.limit(params.limit) as typeof query;
    }

    if (params.offset) {
        query = query.offset(params.offset) as typeof query;
    }

    if (params.sort) {
        query = query.orderBy(params.sort) as typeof query;
    }

    return query.execute();
}
