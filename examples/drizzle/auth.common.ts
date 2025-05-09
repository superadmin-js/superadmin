import { defineLoginView, defineUser } from 'superadmin';
import * as s from 'superadmin/schema';
import * as v from 'superadmin/validation';

export const User = defineUser({
    name: 'user',
    schema: s.object({
        id: s.integer(),
        firstName: s.string(),
        lastName: s.string(),
        email: s.string(),
        role: s.enum(['admin', 'user']),
    }),
});

export const AdminUser = User.with(user => user.role === 'admin');

export const LoginView = defineLoginView({
    path: '/login',
    form: s.object({
        email: s.string({
            validate: [v.required(), v.email()],
        }),
        password: s.password({
            validate: [v.required()],
        }),
    }),
});
