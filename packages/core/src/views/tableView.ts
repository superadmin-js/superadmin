import * as s from '@superadmin/schema';

import { defineGenericView } from './defineGenericView.js';
import type { View } from './defineView.js';
import { defineView } from './defineView.js';
import type { Action, ActionDefinition } from '../actions/defineAction.js';
import { defineAction } from '../actions/defineAction.js';

export interface TableViewConfig<TRow extends s.ObjectSchemaAny, TParams extends s.SchemaAny> {
    name: string;
    params?: TParams;
    path?: string;
    rowSchema: TRow;
    rowActions?: (data: s.SchemaValue<TRow>) => Action[];
}

export interface TableView<
    TRow extends s.ObjectSchemaAny = s.ObjectSchemaAny,
    TParams extends s.SchemaAny = s.Schema<unknown>,
> extends View {
    name: string;
    params: TParams;
    actions: {
        fetch: ActionDefinition<TParams, s.ArraySchema<{ of: TRow }>>;
    };
    rowSchema: TRow;
    rowActions?: (data: s.SchemaValue<TRow>) => Action[];
}

export const tableGenericView = defineGenericView({
    name: 'superadmin:table',
});

export function tableView<
    TRow extends s.ObjectSchemaAny,
    TParams extends s.SchemaAny = s.Schema<void>,
>(config: TableViewConfig<TRow, TParams>): TableView<TRow, TParams> {
    const params = config.params ?? (s.void() as TParams);
    const rowSchema = config.rowSchema;

    const actions = {
        fetch: defineAction({
            name: `${config.name}:fetch`,
            params: params,
            result: s.array({
                of: rowSchema,
            }),
        }),
    };

    return defineView({
        name: config.name,
        generic: tableGenericView,
        params,
        path: config.path,
        actions,
        rowSchema,
        rowActions: config.rowActions,
    });
}
