import { SignJWT } from 'jose';

import type { AuthData } from '@superadmin/core/auth/AuthData.js';
import type { AuthenticateInput } from '@superadmin/core/auth/authenticate.js';
import { AuthRegistry } from '@superadmin/core/auth/AuthRegistry.js';
import { defineFunctionHandler } from '@superadmin/core/functions/defineFunctionHandler.js';
import { authenticateTransform } from '@superadmin/core/internal';

import { AuthSecret } from './AuthSecret.js';

/** Handles authentication by generating signed JWT auth and refresh tokens from user credentials. */
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

        /** Parameters for generating a signed JWT token. */
        interface TokenParams {
            /** Authenticated user input containing user type and data. */
            auth: AuthenticateInput;
            /** Whether this is an auth token or a refresh token. */
            type: 'auth' | 'refresh';
            /** Secret key used for signing. */
            secret: Uint8Array;
            /** Token issuance timestamp. */
            timestamp: Date;
            /** Token expiration date. */
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
