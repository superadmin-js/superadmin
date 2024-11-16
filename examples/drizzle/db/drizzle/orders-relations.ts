import { relations } from 'drizzle-orm';
import { orders } from './orders.js';
import { customers } from './customers.js';
import { orderItems } from './order-items.js';

export const ordersRelations = relations(orders, helpers => ({
    customer: helpers.one(customers, {
        relationName: 'CustomerToOrder',
        fields: [orders.customerId],
        references: [customers.id],
    }),
    items: helpers.many(orderItems, { relationName: 'OrderToOrderItem' }),
}));
