import * as s from '@superadmin/schema';

import { defineGenericView } from './defineGenericView.js';
import type { View } from './defineView.js';
import { defineView } from './defineView.js';
import type { ActionButton } from '../actions/ActionButton.js';
import type { ActionMenuItem } from '../actions/ActionMenuItem.js';
import type { ActionDefinition } from '../actions/defineAction.js';
import { defineAction } from '../actions/defineAction.js';

export interface TableViewConfig<R extends s.ObjectSchemaAny, P extends s.SchemaAny> {
    name: string;
    params?: P;
    path?: string;
    headerActions?: (params: s.SchemaValue<P>) => ActionButton[];
    rowSchema: R;
    rowMenu?: (data: s.SchemaValue<R>) => ActionMenuItem[];
}

export interface TableView<
    D extends s.ObjectSchemaAny = s.ObjectSchemaAny,
    P extends s.SchemaAny = s.Schema<unknown>,
> extends View<P> {
    name: string;
    actions: {
        fetch: ActionDefinition<P, s.ArraySchema<{ of: D }>>;
    };
    headerActions?: (params: s.SchemaValue<P>) => ActionButton[];
    rowSchema: D;
    rowMenu?: (data: s.SchemaValue<D>) => ActionMenuItem[];
}

export const tableGenericView = defineGenericView({
    name: 'superadmin.table',
});

export function defineTableView<
    TRow extends s.ObjectSchemaAny,
    TParams extends s.SchemaAny = s.Schema<void>,
>(config: TableViewConfig<TRow, TParams>): TableView<TRow, TParams> {
    const params = config.params ?? (s.void({ nullable: true }) as TParams);
    const rowSchema = config.rowSchema;

    return defineView({
        name: config.name,
        generic: tableGenericView,
        params,
        path: config.path,
        headerActions: config.headerActions,
        rowSchema,
        rowMenu: config.rowMenu,
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
