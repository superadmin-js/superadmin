import { randomString } from '@nzyme/crypto-utils';
import { defineService } from '@nzyme/ioc';

export const AuthSecret = defineService<Uint8Array | Promise<Uint8Array>>({
    name: 'AuthSecret',
    setup() {
        return new TextEncoder().encode(process.env.SUPERADMIN_SECRET || randomString(32));
    },
});
