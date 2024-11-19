import { type SQL, type SQLWrapper, desc } from 'drizzle-orm';

import type { Container } from '@nzyme/ioc';
import { defineModule } from '@superadmin/core';
import type { Entity } from '@superadmin/drizzle-core';
import { DrizzleWrapper, EntityRegistry } from '@superadmin/drizzle-core';
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

    for (const [key, column] of Object.entries(entity.listView.schema.props)) {
        columns[key] = column.sql;
    }

    const fetch = defineActionHandler({
        action: entity.listView.actions.fetch,
        setup({ inject }) {
            const drizzle = inject(DrizzleWrapper);

            return params => {
                console.log(params);
                let sort: SQL | undefined;
                if (params.sort) {
                    sort = columns[params.sort.by] as SQL;

                    if (params.sort.direction === 'desc') {
                        sort = desc(sort);
                    }
                }

                return drizzle.query({
                    table: entity.table,
                    columns,
                    sort,
                });
            };
        },
    });

    fetch.install(container);
}
