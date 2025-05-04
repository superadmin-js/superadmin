import createDebug from 'debug';
import { computed, watch } from 'vue';

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
        const debug = createDebug('superadmin:auth');

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
        let refreshTimeout: ReturnType<typeof setTimeout>;

        watch(
            authData,
            auth => {
                if (refreshTimeout) {
                    clearTimeout(refreshTimeout);
                }

                if (!auth) {
                    return;
                }

                const expireAt = auth.authExpiration.getTime();
                const refreshAt = expireAt - 1000 * 60 * 5; // 5 minutes before expiry
                const now = Date.now();

                if (now >= refreshAt) {
                    setTimeout(() => void checkAuth());
                    return;
                }

                refreshTimeout = setTimeout(() => void checkAuth(), refreshAt - now);
            },
            { immediate: true },
        );

        return reactive({
            auth,
            authToken,
            setAuth,
            checkAuth,
        });

        function setAuth(auth: AuthData | null) {
            if (auth) {
                debug('Authenticated user %s %O', auth?.userType, auth?.userData);
            } else {
                debug('Unauthenticated');
            }

            authData.value = auth;
        }

        async function checkAuth() {
            debug('Checking authentication');

            let auth = authData.value;
            if (!auth) {
                return false;
            }

            let now = Date.now();
            let expireAt = auth.authExpiration.getTime();
            const checkAt = expireAt - 1000 * 60 * 5;

            if (now < checkAt) {
                debug('Authentication still valid');
                return true;
            }

            if (now >= auth.refreshExpiration.getTime()) {
                debug('Refresh token expired');
                setAuth(null);
                return false;
            }

            const userType = authRegistry.resolveUserType(auth.userType);
            if (!userType) {
                debug('Invalid user type');
                setAuth(null);
                return false;
            }

            debug('Refreshing authentication token');
            await inject(ActionDispatcher)(userType.actions.refresh(auth.refreshToken));

            auth = authData.value;
            if (!auth) {
                debug('Failed to refresh authentication token');
                return false;
            }

            now = Date.now();
            expireAt = auth.authExpiration.getTime();

            if (now >= expireAt) {
                debug('Failed to refresh authentication token');
                setAuth(null);
                return false;
            }

            return true;
        }
    },
});
