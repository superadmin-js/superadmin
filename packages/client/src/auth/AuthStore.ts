import { defineService } from '@nzyme/ioc';
import { reactive, storageRef } from '@nzyme/vue-utils';
import createDebug from 'debug';
import { computed } from 'vue';

import type { AuthContext } from '@superadmin/core';
import { AuthData, AuthRegistry } from '@superadmin/core';
import * as s from '@superadmin/schema';

import { RuntimeConfig } from '../RuntimeConfig.js';

/**
 *
 */
export const AuthStore = defineService({
    name: 'AuthStore',
    deps: {
        authRegistry: AuthRegistry,
        runtimeConfig: RuntimeConfig,
    },
    setup({ authRegistry, runtimeConfig }) {
        const debug = createDebug('superadmin:auth');

        const authData = storageRef<AuthData | null>({
            key: `${runtimeConfig.storagePrefix}:auth`,
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
            authData,
            authToken,
            setAuth,
        });

        function setAuth(auth: AuthData | null) {
            if (auth) {
                debug('Authenticated user %s %O', auth?.userType, auth?.userData);
            } else {
                debug('Unauthenticated');
            }

            authData.value = auth;
        }
    },
});
