import { defineLoginView, defineUser } from '@superadmin/core';
import * as s from '@superadmin/schema';
import * as v from '@superadmin/validation';

export const User = defineUser({
    name: 'user',
    schema: s.object({
        props: {
            id: s.integer(),
            firstName: s.string(),
            lastName: s.string(),
            email: s.string(),
            role: s.enum(['admin', 'user']),
        },
    }),
});

export const AdminUser = User.with(user => user.role === 'admin');

export const LoginView = defineLoginView({
    name: 'login',
    path: '/login',
    form: s.object({
        props: {
            email: s.string({
                validators: [v.requiredValidator(), v.emailValidator()],
            }),
            password: s.password({
                validators: [v.requiredValidator()],
            }),
        },
    }),
});
