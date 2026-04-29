import * as s from '@superadmin/schema';

import { defineAction } from '../actions/defineAction.js';
import type { ComponentAny } from '../defineComponent.js';
import { defineComponent } from '../defineComponent.js';
import { defineView } from '../views/defineView.js';
import { noAuth } from './defineAuthorizer.js';

/** Configuration options for defining a login view. */
export interface LoginViewConfig<TForm extends s.Schema> {
    /** Display title for the login page. */
    title?: string;
    /** URL path for the login page. */
    path?: string;
    /** Schema for the login form fields. */
    form?: TForm;
}

/** Type alias for the return type of {@link defineLoginView}. */
export type LoginView<TForm extends s.Schema = s.Schema> = ReturnType<
    typeof defineLoginView<TForm>
>;

/** Shared component definition for all login views. */
export const loginComponent = defineComponent<LoginView['component']>();

/** Creates a login view with a submit action, accessible without authentication. */
export function defineLoginView<TForm extends s.Schema = s.Schema<void>>(
    config: LoginViewConfig<TForm>,
) {
    const component = loginComponent as ComponentAny;

    return defineView({
        title: config.title || 'Login',
        path: config.path,
        auth: noAuth,
        component,
        navigation: false,
        config: {
            form: config.form,
        },
        actions: {
            submit: defineAction({
                params: config.form,
                result: s.action(),
                auth: noAuth,
            }),
        },
    });
}
