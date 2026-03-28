import {
  pgTable,
  uuid,
  text,
  numeric,
  integer,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { orderStatus, orderItemStatus } from './enums';
import { users } from './users';
import { sellerAccounts } from './sellers';
import { productVariants } from './products';

export const orders = pgTable(
  'order',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    status: orderStatus('status').notNull().default('pending'),
    currency: text('currency').notNull(),
    totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
    subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
    shipmentFee: numeric('shipment_fee', { precision: 10, scale: 2 })
      .notNull()
      .default('0'),
    shippingAddress: text('shipping_address').notNull(),
    billingAddress: text('billing_address').notNull(),
    customerId: uuid('customer_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    guestEmail: text('guest_email'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index('idx_order_customer_id').on(t.customerId)],
);

export const orderItems = pgTable(
  'order_item',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    productVariantId: uuid('product_variant_id')
      .notNull()
      .references(() => productVariants.id, { onDelete: 'restrict' }),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
    currency: text('currency').notNull(),
    quantity: integer('quantity').notNull(),
    title: text('title').notNull(),
    sellerId: uuid('seller_id')
      .notNull()
      .references(() => sellerAccounts.userId, { onDelete: 'restrict' }),
    status: orderItemStatus('status').notNull().default('pending'),
    orderId: uuid('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    dispatchedAt: timestamp('dispatched_at', { withTimezone: true }),
    deliveredAt: timestamp('delivered_at', { withTimezone: true }),
    cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('idx_order_item_order_id').on(t.orderId),
    index('idx_order_item_seller_id').on(t.sellerId),
    index('idx_order_item_product_variant_id').on(t.productVariantId),
  ],
);
