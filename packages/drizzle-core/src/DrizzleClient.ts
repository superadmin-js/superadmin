import { defineInterface } from '@nzyme/ioc';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';

import type { DrizzleSchema } from './types.js';

/**
 *
 */
export type DrizzleClient = LibSQLDatabase<DrizzleSchema> | PgDatabase<PgQueryResultHKT>;

/**
 *
 */
export const DrizzleClient = defineInterface<DrizzleClient>({
    name: 'DrizzleClient',
});
