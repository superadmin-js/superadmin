import { randomString } from '@nzyme/crypto';
import { defineInterface } from '@nzyme/ioc/Interface.js';

/**
 *
 */
export const AuthSecret = defineInterface<Promise<Uint8Array> | Uint8Array>({
    name: 'AuthSecret',
    default() {
        return new TextEncoder().encode(process.env.SUPERADMIN_SECRET || randomString(32));
    },
});
