import { sqliteTable, integer } from 'drizzle-orm/sqlite-core';

export const orders = sqliteTable('Order', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    customerId: integer('customerId', { mode: 'number' }).notNull(),
});
