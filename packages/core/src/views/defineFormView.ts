import * as s from '@superadmin/schema';

import { defineGenericView } from './defineGenericView.js';
import type { View } from './defineView.js';
import { defineView } from './defineView.js';
import type { ActionDefinition } from '../actions/defineAction.js';
import { defineAction } from '../actions/defineAction.js';

export interface FormViewConfig<S extends s.ObjectSchemaAny, TParams extends s.SchemaAny> {
    name: string;
    params?: TParams;
    path?: string;
    schema: S;
}

export interface FormView<
    S extends s.ObjectSchemaAny = s.ObjectSchemaAny,
    P extends s.SchemaAny = s.Schema<unknown>,
> extends View<P> {
    name: string;
    actions: {
        fetch: ActionDefinition<P, S>;
        submit: ActionDefinition<S, s.ActionSchema<{ nullable: true; optional: true }>>;
    };
    schema: S;
}

export const formGenericView = defineGenericView({
    name: 'superadmin.form',
});

export function defineFormView<S extends s.ObjectSchemaAny, P extends s.Schema = s.Schema<void>>(
    config: FormViewConfig<S, P>,
): FormView<S, P> {
    const params = config.params ?? (s.void() as P);
    const schema = config.schema;

    return defineView({
        name: config.name,
        generic: formGenericView,
        params,
        path: config.path,
        schema,
        actions: {
            fetch: defineAction({
                name: `${config.name}.fetch`,
                params: params,
                result: schema,
                handler: () => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    return () => s.coerce(schema);
                },
            }),
            submit: defineAction({
                name: `${config.name}.submit`,
                params: schema,
                result: s.action({ nullable: true, optional: true }),
            }),
        },
    });
}
