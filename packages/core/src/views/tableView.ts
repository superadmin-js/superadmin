import type { Schema, SchemaAny } from '@nzyme/zchema';
import * as z from '@nzyme/zchema';

import type { View } from './defineView.js';
import { defineView } from './defineView.js';
import type { ActionDefinition } from '../defineAction.js';
import { defineAction } from '../defineAction.js';
import { defineGenericView } from './defineGenericView.js';

export interface TableViewConfig<
    TData extends SchemaAny = Schema<unknown>,
    TParams extends SchemaAny = Schema<unknown>,
> {
    name: string;
    params?: TParams;
    path?: string;
    data: TData;
}

export interface TableView<
    TData extends SchemaAny = Schema<unknown>,
    TParams extends SchemaAny = Schema<unknown>,
> extends View {
    name: string;
    params: TParams;
    data: TData;
    actions: {
        fetch: ActionDefinition<TParams, TData>;
    };
}

export const tableGenericView = defineGenericView({
    name: 'superadmin:table',
});

export function tableView<TData extends SchemaAny, TParams extends SchemaAny = Schema<void>>(
    config: TableViewConfig<TData, TParams>,
): TableView<TData, TParams> {
    const params = config.params ?? (z.void() as TParams);
    const data = config.data;

    const actions = {
        fetch: defineAction({
            name: `${config.name}:fetch`,
            input: params,
            output: data,
        }),
    };

    return defineView({
        name: config.name,
        generic: tableGenericView,
        params,
        path: config.path,
        data,
        actions,
    });
}
