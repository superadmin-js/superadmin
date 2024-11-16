import { sqliteTable, integer } from 'drizzle-orm/sqlite-core';

export const orderItems = sqliteTable('OrderItem', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    orderId: integer('orderId', { mode: 'number' }).notNull(),
    productId: integer('productId', { mode: 'number' }).notNull(),
});
