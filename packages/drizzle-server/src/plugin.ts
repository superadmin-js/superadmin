import { desc } from 'drizzle-orm';
import type { SQL, SQLWrapper } from 'drizzle-orm';

import type { Submodule } from '@superadmin/core';
import { defineSubmodule } from '@superadmin/core/defineSubmodule.js';
import { defineActionHandler } from '@superadmin/core/actions/defineActionHandler.js';
import type { Entity } from '@superadmin/drizzle-core/defineEntityTableView.js';
import { DrizzleClient } from '@superadmin/drizzle-core/DrizzleClient.js';
import { EntityRegistry } from '@superadmin/drizzle-core/EntityRegistry.js';
import * as s from '@superadmin/schema';

import { queryDrizzle } from './utils/queryDrizzle.js';

/**
 *
 */
export const plugin = defineSubmodule({
    install(container) {
        const entities = container.resolve(EntityRegistry);
        const submodules: Record<string, Submodule> = {};

        for (const entity of entities.getAll()) {
            const tableSubmodules = setupEntityTableView(entity);
            Object.assign(submodules, tableSubmodules);
        }

        return submodules;
    },
});

function setupEntityTableView(entity: Entity) {
    const columns: Record<string, SQLWrapper> = {};
    const table = entity.table;
    const tableView = entity.tableView;
    const tableConfig = tableView.config;

    for (const [key, column] of Object.entries(tableConfig.schema.props)) {
        columns[key] = column.sql;
    }

    const tableFetch = defineActionHandler({
        action: tableView.actions.fetch,
        deps: {
            drizzle: DrizzleClient,
        },
        setup({ drizzle }) {
            return async params => {
                let sort: SQL | undefined;
                if (params.sort) {
                    sort = columns[params.sort.by] as SQL;

                    if (params.sort.direction === 'desc') {
                        sort = desc(sort);
                    }
                }

                const pagination = params.pagination ?? s.coerce(tableConfig.pagination.params);
                const offset = (pagination.page - 1) * pagination.pageSize;
                const limit = pagination.pageSize + 1;

                const rows = await queryDrizzle({
                    drizzle,
                    table,
                    columns,
                    sort,
                    offset,
                    limit,
                });

                const hasMore = rows.length > pagination.pageSize;
                if (hasMore) {
                    rows.pop();
                }

                return {
                    rows,
                    pagination: {
                        hasMore,
                        page: pagination.page,
                        pageSize: pagination.pageSize,
                    },
                };
            };
        },
    });

    return {
        [`${entity.id}:table:fetch`]: tableFetch,
    };
}
