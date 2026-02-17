import * as s from '@superadmin/schema';

import { defineAction } from '../actions/defineAction.js';
import type { ComponentAny } from '../defineComponent.js';
import { defineComponent } from '../defineComponent.js';
import { defineView } from '../views/defineView.js';
import { noAuth } from './defineAuthorizer.js';

/**
 *
 */
export interface LoginViewConfig<TForm extends s.Schema> {
    /**
     *
     */
    title?: string;
    /**
     *
     */
    path?: string;
    /**
     *
     */
    form?: TForm;
}

/**
 *
 */
export type LoginView<TForm extends s.Schema = s.Schema> = ReturnType<
    typeof defineLoginView<TForm>
>;

/**
 *
 */
export const loginComponent = defineComponent<LoginView['component']>();

/**
 *
 */
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
