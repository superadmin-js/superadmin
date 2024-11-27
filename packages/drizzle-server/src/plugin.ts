import { type SQL, type SQLWrapper, desc } from 'drizzle-orm';

import type { Submodule } from '@superadmin/core';
import { defineSubmodule } from '@superadmin/core';
import type { Entity } from '@superadmin/drizzle-core';
import { DrizzleWrapper, EntityRegistry } from '@superadmin/drizzle-core';
import * as s from '@superadmin/schema';
import { defineActionHandler } from '@superadmin/server';

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
    const tableView = entity.tableView;
    const tableConfig = tableView.config;

    for (const [key, column] of Object.entries(tableConfig.schema.props)) {
        columns[key] = column.sql;
    }

    const tableFetch = defineActionHandler({
        action: tableView.actions.fetch,
        setup({ inject }) {
            const drizzle = inject(DrizzleWrapper);

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

                const rows = await drizzle.query({
                    table: entity.table,
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
