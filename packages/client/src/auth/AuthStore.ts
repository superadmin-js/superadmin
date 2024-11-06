import { computed } from 'vue';

import { defineService } from '@nzyme/ioc';
import { reactive, storageRef } from '@nzyme/vue-utils';
import type { AuthContext } from '@superadmin/core';
import { AuthData, AuthRegistry } from '@superadmin/core';
import * as s from '@superadmin/schema';

import { ActionDispatcher } from '../actions/ActionDispatcher.js';

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

        const auth = computed<AuthContext | null>(() => {
            const auth = authData.value;
            if (!auth) {
                return null;
            }

            const user = authRegistry.resolveUserType(auth.userType);
            if (!user) {
                return null;
            }

            return {
                user: s.coerce(user.schema, auth.userData),
                type: auth.userType,
            };
        });

        const authToken = computed(() => authData.value?.authToken);

        return reactive({
            auth,
            authToken,
            setAuth,
            checkAuth,
        });

        function setAuth(auth: AuthData | null) {
            authData.value = auth;
        }

        async function checkAuth() {
            const auth = authData.value;
            if (!auth) {
                return false;
            }

            const now = Date.now();
            const expireAt = auth.authExpiration.getTime();
            const checkAt = expireAt - 1000 * 60 * 5;
            if (now < checkAt) {
                return true;
            }

            if (now >= auth.refreshExpiration.getTime()) {
                setAuth(null);
                return false;
            }

            const userType = authRegistry.resolveUserType(auth.userType);
            if (!userType) {
                setAuth(null);
                return false;
            }

            await inject(ActionDispatcher)(userType.actions.refresh(auth.refreshToken));
        }
    },
});
