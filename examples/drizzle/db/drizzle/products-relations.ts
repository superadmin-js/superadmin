import { relations } from 'drizzle-orm';
import { products } from './products.js';
import { orderItems } from './order-items.js';

export const productsRelations = relations(products, helpers => ({
    orderItems: helpers.many(orderItems, { relationName: 'OrderItemToProduct' }),
}));
