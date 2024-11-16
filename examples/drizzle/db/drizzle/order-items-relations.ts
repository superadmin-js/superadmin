import { relations } from 'drizzle-orm';
import { orderItems } from './order-items.js';
import { orders } from './orders.js';
import { products } from './products.js';

export const orderItemsRelations = relations(orderItems, helpers => ({
    order: helpers.one(orders, {
        relationName: 'OrderToOrderItem',
        fields: [orderItems.orderId],
        references: [orders.id],
    }),
    product: helpers.one(products, {
        relationName: 'OrderItemToProduct',
        fields: [orderItems.productId],
        references: [products.id],
    }),
}));
