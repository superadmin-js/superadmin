import { SignJWT } from 'jose';

import type { AuthData, AuthenticateInput } from '@superadmin/core';
import { AuthRegistry, defineFunctionHandler } from '@superadmin/core';
import { authenticateTransform } from '@superadmin/core/internal';
import { AuthSecret } from '@superadmin/server';

/**
 *
 */
export const authenticateTransformHandler = defineFunctionHandler({
    function: authenticateTransform,
    deps: {
        authSecret: AuthSecret,
        authRegistry: AuthRegistry,
    },
    setup({ authSecret, authRegistry }) {
        return async input => {
            if (!input) {
                return null;
            }

            const timestamp = new Date();
            const secret = await authSecret;

            const userType = authRegistry.resolveUserType(input.userType);
            if (!userType) {
                throw new Error(`User type ${input.userType} not found`);
            }

            const authExpiration = new Date(timestamp.getTime() + userType.authExpiration);
            const authToken = await generateToken({
                auth: input,
                type: 'auth',
                secret,
                timestamp,
                expiration: authExpiration,
            });

            const refreshExpiration = new Date(timestamp.getTime() + userType.refreshExpiration);
            const refreshToken = await generateToken({
                auth: input,
                type: 'refresh',
                secret,
                timestamp,
                expiration: refreshExpiration,
            });

            const authData: AuthData = {
                userType: input.userType,
                userData: input.userData,
                timestamp,
                authExpiration,
                authToken,
                refreshExpiration,
                refreshToken,
            };

            return authData;
        };

        /**
         *
         */
        interface TokenParams {
            /**
             *
             */
            auth: AuthenticateInput;
            /**
             *
             */
            type: 'auth' | 'refresh';
            /**
             *
             */
            secret: Uint8Array;
            /**
             *
             */
            timestamp: Date;
            /**
             *
             */
            expiration: Date;
        }

        async function generateToken(params: TokenParams) {
            const { auth, type, secret, timestamp, expiration } = params;

            const alg = 'HS256';
            const token: Record<string, unknown> = {
                type,
                user: auth.userType,
            };

            if (auth.userData) {
                for (const [key, value] of Object.entries(auth.userData)) {
                    token[`user:${key}`] = value;
                }
            }

            return await new SignJWT(token)
                .setProtectedHeader({ alg })
                .setIssuedAt(timestamp)
                .setExpirationTime(expiration)
                .sign(secret);
        }
    },
});
