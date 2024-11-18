import type { SQL, SQLWrapper, Table } from 'drizzle-orm';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';
import type { SelectedFields } from 'drizzle-orm/sqlite-core';

import type { Service, ServiceSetup } from '@nzyme/ioc';
import { defineInjectable, defineService } from '@nzyme/ioc';
import type { Module } from '@superadmin/core';
import { defineModule } from '@superadmin/core';

import type { DrizzleSchema } from './types.js';

export type DrizzleClient = LibSQLDatabase<DrizzleSchema> | PgDatabase<PgQueryResultHKT>;

export const DrizzleClient = defineInjectable<DrizzleClient>({
    name: 'DrizzleClient',
});

export function defineDrizzle<TDrizzle extends DrizzleClient>(
    setup: ServiceSetup<TDrizzle>,
): Service<TDrizzle> & Module {
    const service = defineService({
        name: 'DrizzleClient',
        for: DrizzleClient,
        setup,
    });

    return defineModule({
        ...service,
        install(container) {
            container.set(DrizzleClient, service);
        },
    });
}

interface QueryParams {
    table: Table;
    columns: Record<string, SQLWrapper>;
    where?: SQL;
    limit?: number;
    offset?: number;
}

export interface DrizzleWrapper {
    query(params: QueryParams): Promise<Record<string, unknown>[]>;
}

export const DrizzleWrapper = defineService<DrizzleWrapper>({
    name: 'DrizzleWrapper',
    setup({ inject }) {
        const drizzle = inject(DrizzleClient) as LibSQLDatabase<DrizzleSchema>;

        return {
            query: params => {
                let query = drizzle
                    .select(params.columns as SelectedFields)
                    .from(params.table)
                    .where(params.where);

                if (params.limit) {
                    query = query.limit(params.limit) as typeof query;
                }

                if (params.offset) {
                    query = query.offset(params.offset) as typeof query;
                }

                return query.execute();
            },
        };
    },
});
