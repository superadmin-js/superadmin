import { defineService } from '@nzyme/ioc';
import { Logger } from '@nzyme/logging';
import { createSingleRunner } from '@nzyme/utils';
import { watch } from 'vue';

import { ApplicationError, AuthRegistry, createAction } from '@superadmin/core';

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
        logger: Logger,
    },
    setup({ authRegistry, authStore, actionDispatcher, logger }) {
        let refreshTimeout: ReturnType<typeof setTimeout>;
        const checkAuthRunner = createSingleRunner({ handler: checkAuth });

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
                    setTimeout(checkAuthRunner.execute);
                    return;
                }

                refreshTimeout = setTimeout(checkAuthRunner.execute, refreshAt - now);
            },
            { immediate: true },
        );

        return checkAuthRunner.execute;

        async function checkAuth() {
            logger.debug('Checking authentication');

            let auth = authStore.authData;
            if (!auth) {
                return false;
            }

            let now = Date.now();
            let expireAt = auth.authExpiration.getTime();
            const checkAt = expireAt - 1000 * 60 * 5;

            if (now < checkAt) {
                logger.debug('Authentication still valid');
                return true;
            }

            if (now >= auth.refreshExpiration.getTime()) {
                logger.debug('Refresh token expired');
                authStore.setAuth(null);
                return false;
            }

            const userType = authRegistry.resolveUserType(auth.userType);
            if (!userType) {
                logger.debug('Invalid user type');
                authStore.setAuth(null);
                return false;
            }

            logger.debug('Refreshing authentication token');
            const action = createAction(userType.actions.refresh, auth.refreshToken);
            try {
                await actionDispatcher(action);
            } catch (error) {
                authStore.setAuth(null);
                if (error instanceof ApplicationError && error.name === 'Unauthorized') {
                    return false;
                }

                logger.error('Failed to refresh authentication token', { error });
                return false;
            }

            auth = authStore.authData;
            if (!auth) {
                logger.debug('Failed to refresh authentication token');
                return false;
            }

            now = Date.now();
            expireAt = auth.authExpiration.getTime();

            if (now >= expireAt) {
                logger.debug('Failed to refresh authentication token');
                authStore.setAuth(null);
                return false;
            }

            return true;
        }
    },
});
