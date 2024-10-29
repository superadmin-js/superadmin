import * as s from '@superadmin/schema';

import { defineGenericView } from './defineGenericView.js';
import type { View } from './defineView.js';
import { defineView } from './defineView.js';
import type { ActionDefinition } from '../actions/defineAction.js';
import { defineAction } from '../actions/defineAction.js';

export interface TableViewConfig<TRow extends s.ObjectSchemaAny, TParams extends s.SchemaAny> {
    name: string;
    params?: TParams;
    path?: string;
    rowSchema: TRow;
    rowActions?: (data: s.SchemaValue<TRow>) => s.Action[];
}

export interface TableView<
    D extends s.ObjectSchemaAny = s.ObjectSchemaAny,
    P extends s.SchemaAny = s.Schema<unknown>,
> extends View<P> {
    name: string;
    actions: {
        fetch: ActionDefinition<P, s.ArraySchema<{ of: D }>>;
    };
    rowSchema: D;
    rowActions?: (data: s.SchemaValue<D>) => s.Action[];
}

export const tableGenericView = defineGenericView({
    name: 'superadmin.table',
});

export function defineTableView<
    TRow extends s.ObjectSchemaAny,
    TParams extends s.SchemaAny = s.Schema<void>,
>(config: TableViewConfig<TRow, TParams>): TableView<TRow, TParams> {
    const params = config.params ?? (s.void() as TParams);
    const rowSchema = config.rowSchema;

    return defineView({
        name: config.name,
        generic: tableGenericView,
        params,
        path: config.path,
        rowSchema,
        rowActions: config.rowActions,
        actions: {
            fetch: defineAction({
                name: `${config.name}.fetch`,
                params: params,
                result: s.array({
                    of: rowSchema,
                }),
            }),
        },
    });
}
