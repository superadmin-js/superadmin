import { SignJWT } from 'jose';

import { randomString } from '@nzyme/crypto-utils';
import type { AuthenticateAction } from '@superadmin/core';

const secret = new TextEncoder().encode(process.env.SUPERADMIN_SECRET || randomString(32));
const AUTH_EXPIRATION_MS = 15 * 60 * 1000;
const REFRESH_EXPIRATION_MS = 30 * 24 * 60 * 60 * 1000;

export async function signAuthentication(action: AuthenticateAction) {
    const timestamp = new Date();

    const authExpiration = new Date(timestamp.getTime() + AUTH_EXPIRATION_MS);
    const authToken = await generateToken({
        action,
        type: 'auth',
        secret,
        timestamp,
        expiration: authExpiration,
    });

    const refreshExpiration = new Date(timestamp.getTime() + REFRESH_EXPIRATION_MS);
    const refreshToken = await generateToken({
        action,
        type: 'refresh',
        secret,
        timestamp,
        expiration: refreshExpiration,
    });

    action.params.timestamp = timestamp;
    action.params.authExpiration = authExpiration;
    action.params.refreshExpiration = refreshExpiration;
    action.params.authToken = authToken;
    action.params.refreshToken = refreshToken;
}

interface TokenParams {
    action: AuthenticateAction;
    type: 'auth' | 'refresh';
    secret: Uint8Array;
    timestamp: Date;
    expiration: Date;
}

async function generateToken(params: TokenParams) {
    const { action, type, secret, timestamp, expiration } = params;

    const alg = 'HS256';
    const token: Record<string, unknown> = {
        type,
        user: action.params.userType,
    };

    for (const [key, value] of Object.entries(action.params.userData)) {
        token[`user:${key}`] = value;
    }

    return await new SignJWT(token)
        .setProtectedHeader({ alg })
        .setIssuedAt(timestamp)
        .setExpirationTime(expiration)
        .sign(secret);
}
