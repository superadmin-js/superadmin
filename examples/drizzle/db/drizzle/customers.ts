import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const customers = sqliteTable('Customer', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    firstName: text('firstName').notNull(),
    lastName: text('lastName').notNull(),
    email: text('email').notNull(),
    phone: text('phone'),
});
