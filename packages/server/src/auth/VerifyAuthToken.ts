import { defineService } from '@nzyme/ioc';
import { jwtVerify } from 'jose';

import type { AuthContext } from '@superadmin/core';
import { AuthRegistry } from '@superadmin/core';
import { coerce } from '@superadmin/schema';

import { AuthSecret } from './AuthSecret.js';

/**
 *
 */
export const VerifyAuthToken = defineService({
    deps: {
        authRegistry: AuthRegistry,
        authSecret: AuthSecret,
    },
    setup({ authRegistry, authSecret }) {
        return async (token: string | null | undefined) => {
            if (!token) {
                return null;
            }

            const payload = await verifyToken(token);
            if (!payload) {
                return null;
            }

            const userType = authRegistry.resolveUserType(String(payload.user));
            if (!userType) {
                return null;
            }

            const userData: Record<string, unknown> = {};
            for (const [key, value] of Object.entries(payload)) {
                if (key.startsWith('user:')) {
                    userData[key.slice(5)] = value;
                }
            }

            const user = coerce(userType.schema, userData) as object;

            const auth: AuthContext = {
                user,
                type: userType.name,
            };

            return {
                auth,
                type: payload.type as 'auth' | 'refresh',
            };
        };

        async function verifyToken(token: string) {
            try {
                const { payload } = await jwtVerify(token, await authSecret);
                return payload;
            } catch {
                return null;
            }
        }
    },
});
