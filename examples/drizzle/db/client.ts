import { defineService } from '@superadmin/ioc';
import { drizzle } from 'drizzle-orm/libsql';

import * as schema from './schema.js';

export const DatabaseClient = defineService({
    name: 'DatabaseClient',
    setup() {
        return drizzle({
            connection: {
                url: 'file:./db/db.sqlite',
            },
            schema,
        });
    },
});
