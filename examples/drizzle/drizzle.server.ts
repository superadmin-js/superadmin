import { defineDrizzle } from '@superadmin/drizzle';
import { drizzle } from 'drizzle-orm/libsql';

import schema from './db/schema.js';

export const Drizzle = defineDrizzle({
    setup() {
        return drizzle({
            connection: {
                url: 'file:./db/db.sqlite',
            },
            schema,
        });
    },
});
