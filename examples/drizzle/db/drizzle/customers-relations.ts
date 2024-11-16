import { relations } from 'drizzle-orm';
import { customers } from './customers.js';
import { orders } from './orders.js';

export const customersRelations = relations(customers, helpers => ({
    orders: helpers.many(orders, { relationName: 'CustomerToOrder' }),
}));
