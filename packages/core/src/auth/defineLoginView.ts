import type * as s from '@superadmin/schema';

import { noAuth } from './defineAuthorizer.js';
import { defineGenericView } from '../views/defineGenericView.js';
import { type View, defineView } from '../views/defineView.js';

export interface LoginViewConfig<TForm extends s.Schema> {
    name: string;
    title?: string;
    path?: string;
    form?: TForm;
}

export interface LoginView<TForm extends s.Schema = s.Schema> extends View {
    form?: TForm;
}

export const loginGenericView = defineGenericView({
    name: 'superadmin.login',
});

export function defineLoginView<TForm extends s.Schema = s.Schema<void>>(
    config: LoginViewConfig<TForm>,
): LoginView<TForm> {
    return defineView({
        name: config.name,
        title: config.title,
        path: config.path,
        form: config.form,
        auth: noAuth,
        generic: loginGenericView,
        navigation: false,
    });
}
