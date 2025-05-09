import { defineInjectable } from '@nzyme/ioc';

import * as s from '@superadmin/schema';

import { defineAction } from '../actions/defineAction.js';
import type { Authorizer } from '../auth/defineAuthorizer.js';
import type { ComponentAny } from '../defineComponent.js';
import { defineComponent } from '../defineComponent.js';
import { defineView } from './defineView.js';

/**
 *
 */
export interface FormViewConfig<S extends s.ObjectSchema, TParams extends s.Schema> {
    /**
     *
     */
    title?: string;
    /**
     *
     */
    params?: TParams;
    /**
     *
     */
    path?: string;
    /**
     *
     */
    schema: S;
    /**
     *
     */
    auth?: Authorizer | false;
}

/**
 *
 */
export type FormView<
    S extends s.ObjectSchema = s.ObjectSchema,
    P extends s.Schema = s.Schema<unknown>,
> = ReturnType<typeof defineFormView<S, P>>;

/**
 *
 */
export const formComponent = defineComponent<FormView['component']>();

/**
 *
 */
export function defineFormView<S extends s.ObjectSchema, P extends s.Schema = s.Schema<void>>(
    config: FormViewConfig<S, P>,
) {
    const params = config.params ?? (s.void({ nullable: true }) as P);
    const schema = config.schema;

    const component = formComponent as ComponentAny;
    return defineView({
        title: config.title,
        component,
        params,
        path: config.path,
        auth: config.auth,
        config: {
            schema,
        },
        actions: {
            fetch: defineAction({
                params: params,
                result: schema,
                defaultHandler: defineInjectable(() => {
                    return () => s.coerce(schema);
                }),
            }),
            submit: defineAction({
                params: schema,
                result: s.action({ nullable: true, optional: true }),
            }),
        },
    });
}
