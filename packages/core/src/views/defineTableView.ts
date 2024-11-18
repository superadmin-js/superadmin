import * as s from '@superadmin/schema';

import { defineGenericView } from './defineGenericView.js';
import type { View } from './defineView.js';
import { defineView } from './defineView.js';
import type { ActionButton } from '../actions/ActionButton.js';
import type { ActionDefinition } from '../actions/defineAction.js';
import { defineAction } from '../actions/defineAction.js';
import type { Authorizer } from '../auth/defineAuthorizer.js';

export interface TableViewOptions<R extends s.NonNullable<s.ObjectSchema>, P extends s.SchemaAny> {
    name: string;
    schema: R;
    params?: P;
    path?: string;
    auth?: Authorizer | false;
    headerButtons?: (params: s.SchemaValue<P>) => ActionButton[];
    rowButtons?: (data: s.SchemaValue<R>) => ActionButton[];
}

export interface TableView<
    R extends s.NonNullable<s.ObjectSchema> = s.NonNullable<s.ObjectSchema>,
    P extends s.SchemaAny = s.Schema<unknown>,
> extends View<P> {
    name: string;
    schema: R;
    actions: {
        fetch: ActionDefinition<P, s.ArraySchema<{ of: R }>>;
    };
    headerButtons?: (params: s.SchemaValue<P>) => ActionButton[];
    rowButtons?: (data: s.SchemaValue<R>) => ActionButton[];
}

export const tableGenericView = defineGenericView({
    name: 'superadmin.table',
});

export function defineTableView<
    TRow extends s.NonNullable<s.ObjectSchema>,
    TParams extends s.SchemaAny = s.Schema<void>,
>(config: TableViewOptions<TRow, TParams>): TableView<TRow, TParams> {
    const params = config.params ?? (s.void({ nullable: true }) as TParams);
    const schema = config.schema;

    return defineView({
        name: config.name,
        schema,
        generic: tableGenericView,
        params,
        path: config.path,
        auth: config.auth,
        headerButtons: config.headerButtons,
        rowButtons: config.rowButtons,
        actions: {
            fetch: defineAction({
                name: `${config.name}.fetch`,
                params: params,
                result: s.array({ of: schema }),
                auth: config.auth,
            }),
        },
    });
}
