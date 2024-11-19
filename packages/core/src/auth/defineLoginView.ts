import * as s from '@superadmin/schema';

import { noAuth } from './defineAuthorizer.js';
import { defineAction } from '../actions/defineAction.js';
import { defineGenericView } from '../views/defineGenericView.js';
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

export const loginGenericView = defineGenericView({
    name: 'superadmin.login',
});

export function defineLoginView<TForm extends s.Schema = s.Schema<void>>(
    config: LoginViewConfig<TForm>,
) {
    return defineView({
        name: config.name,
        title: config.title,
        path: config.path,
        form: config.form,
        auth: noAuth,
        generic: loginGenericView,
        navigation: false,
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
