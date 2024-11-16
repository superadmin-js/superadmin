import * as users from './users.js';
import * as customers from './customers.js';
import * as products from './products.js';
import * as orders from './orders.js';
import * as orderItems from './order-items.js';
import * as customersRelations from './customers-relations.js';
import * as productsRelations from './products-relations.js';
import * as ordersRelations from './orders-relations.js';
import * as orderItemsRelations from './order-items-relations.js';

export const schema = {
    ...users,
    ...customers,
    ...products,
    ...orders,
    ...orderItems,
    ...customersRelations,
    ...productsRelations,
    ...ordersRelations,
    ...orderItemsRelations,
};
