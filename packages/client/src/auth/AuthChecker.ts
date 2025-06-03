import { defineService } from '@nzyme/ioc';
import { withSingleExecution } from '@nzyme/utils';
import createDebug from 'debug';
import { watch } from 'vue';

import { AuthRegistry, createAction } from '@superadmin/core';

import { ActionDispatcher } from '../actions/ActionDispatcher.js';
import { AuthStore } from './AuthStore.js';

/**
 *
 */
export const AuthChecker = defineService({
    name: 'AuthChecker',
    deps: {
        authRegistry: AuthRegistry,
        authStore: AuthStore,
        actionDispatcher: ActionDispatcher,
    },
    setup({ authRegistry, authStore, actionDispatcher }) {
        const debug = createDebug('superadmin:auth');

        let refreshTimeout: ReturnType<typeof setTimeout>;
        const checkAuthOnce = withSingleExecution(checkAuth);

        watch(
            () => authStore.authData,
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
                    setTimeout(() => void checkAuthOnce());
                    return;
                }

                refreshTimeout = setTimeout(() => void checkAuthOnce(), refreshAt - now);
            },
            { immediate: true },
        );

        return checkAuthOnce;

        async function checkAuth() {
            debug('Checking authentication');

            let auth = authStore.authData;
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
                authStore.setAuth(null);
                return false;
            }

            const userType = authRegistry.resolveUserType(auth.userType);
            if (!userType) {
                debug('Invalid user type');
                authStore.setAuth(null);
                return false;
            }

            debug('Refreshing authentication token');
            const action = createAction(userType.actions.refresh, auth.refreshToken);
            await actionDispatcher(action);

            auth = authStore.authData;
            if (!auth) {
                debug('Failed to refresh authentication token');
                return false;
            }

            now = Date.now();
            expireAt = auth.authExpiration.getTime();

            if (now >= expireAt) {
                debug('Failed to refresh authentication token');
                authStore.setAuth(null);
                return false;
            }

            return true;
        }
    },
});
