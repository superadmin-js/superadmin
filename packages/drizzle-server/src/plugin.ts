import { type SQL, type SQLWrapper, desc } from 'drizzle-orm';

import type { Container } from '@nzyme/ioc';
import { defineModule } from '@superadmin/core';
import type { Entity } from '@superadmin/drizzle-core';
import { DrizzleWrapper, EntityRegistry } from '@superadmin/drizzle-core';
import * as s from '@superadmin/schema';
import { defineActionHandler } from '@superadmin/server';

export default defineModule({
    install(container) {
        const entities = container.resolve(EntityRegistry);

        for (const entity of entities.getAll()) {
            setupEntityTableView(container, entity);
        }
    },
});

function setupEntityTableView(container: Container, entity: Entity) {
    const columns: Record<string, SQLWrapper> = {};
    const tableView = entity.tableView;
    const tableConfig = tableView.config;

    for (const [key, column] of Object.entries(tableConfig.schema.props)) {
        columns[key] = column.sql;
    }

    const fetch = defineActionHandler({
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

    fetch.install(container);
}
