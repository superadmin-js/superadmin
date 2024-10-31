import { authenticate, showToast } from '@superadmin/core';
import { defineActionHandler } from '@superadmin/server';

import { LoginView, User } from './auth.common.js';

export const LoginHandler = defineActionHandler({
    action: LoginView.actions.submit,
    setup({ inject }) {
        return form => {
            if (form.email === 'kedrzu@gmail.com' && form.password === 'asdasdasd') {
                return authenticate(User, {
                    id: 1n,
                    email: form.email,
                    firstName: 'Michał',
                    lastName: 'Kędrzyński',
                    role: 'admin',
                });
            }

            return showToast({
                title: 'Login failed',
                message: form.email,
                type: 'error',
                time: 5000,
            });
        };
    },
});
