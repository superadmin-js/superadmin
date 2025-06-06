import { authenticate, showToast } from 'superadmin';
import { defineActionHandler } from 'superadmin';

import { LoginView, User } from './auth.common.js';

export const LoginHandler = defineActionHandler({
    action: LoginView.actions.submit,
    setup() {
        return form => {
            if (form.email === 'kedrzu@gmail.com' && form.password === 'asdasdasd') {
                return authenticate(User, {
                    id: 1,
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

export const RefreshHandler = defineActionHandler({
    action: User.actions.refresh,
    setup() {
        return user => {
            return authenticate(User, user);
        };
    },
});
