import { computed } from 'vue';

import { defineService } from '@nzyme/ioc';
import { reactive, storageRef } from '@nzyme/vue-utils';
import { AuthData, AuthRegistry } from '@superadmin/core';
import * as s from '@superadmin/schema';

export const AuthStore = defineService({
    name: 'AuthStore',
    setup({ inject }) {
        const authRegistry = inject(AuthRegistry);

        const authData = storageRef<AuthData | null>({
            key: 'superadmin:auth',
            storage: 'local',
            sync: 'always',
            serialize: v => {
                if (v === null) {
                    return JSON.stringify(null);
                }

                return JSON.stringify(s.serialize(AuthData, v));
            },
            deserialize: v => {
                const data = s.coerce(AuthData, JSON.parse(v));
                const errors = s.validate(AuthData, data);
                if (errors) {
                    return null;
                }

                return data;
            },
        });

        const user = computed(() => {
            const auth = authData.value;
            if (!auth) {
                return null;
            }

            const user = authRegistry.resolveUserType(auth.userType);
            if (!user) {
                return null;
            }

            return s.coerce(user.schema, auth.userData);
        });

        return reactive({
            auth: authData,
            user,
            authenticate,
        });

        function authenticate(auth: AuthData) {
            authData.value = auth;
        }
    },
});
