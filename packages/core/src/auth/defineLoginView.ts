import * as s from '@superadmin/schema';

import { noAuth } from './defineAuthorizer.js';
import { defineAction } from '../actions/defineAction.js';
import type { ComponentAny } from '../components/defineComponent.js';
import { defineComponent } from '../components/defineComponent.js';
import { defineView } from '../views/defineView.js';

export interface LoginViewConfig<TForm extends s.Schema> {
    name: string;
    title?: string;
    path?: string;
    form?: TForm;
}

export type LoginView<TForm extends s.Schema = s.Schema> = ReturnType<
    typeof defineLoginView<TForm>
>;

export const loginComponent = defineComponent<LoginView['component']>();

export function defineLoginView<TForm extends s.Schema = s.Schema<void>>(
    config: LoginViewConfig<TForm>,
) {
    const component = loginComponent as ComponentAny;

    return defineView({
        name: config.name,
        title: config.title,
        path: config.path,
        auth: noAuth,
        component,
        navigation: false,
        config: {
            form: config.form,
        },
        actions: {
            submit: defineAction({
                name: `${config.name}.submit`,
                params: config.form,
                result: s.action(),
                auth: noAuth,
            }),
        },
    });
}
