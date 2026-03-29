import {
  pgTable,
  uuid,
  text,
  numeric,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { paymentStatus, payoutStatus } from './enums';
import { users } from './users';
import { sellerAccounts } from './sellers';
import { orders, orderItems } from './orders';

export const payments = pgTable(
  'payment',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    currency: text('currency').notNull(),
    orderId: uuid('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    status: paymentStatus('status').notNull().default('pending'),
    paidAt: timestamp('paid_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('idx_payment_order_id').on(t.orderId),
    index('idx_payment_user_id').on(t.userId),
  ],
);

export const sellerPayouts = pgTable(
  'seller_payout',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    currency: text('currency').notNull(),
    orderItemId: uuid('order_item_id')
      .notNull()
      .references(() => orderItems.id, { onDelete: 'restrict' }),
    sellerId: uuid('seller_id')
      .notNull()
      .references(() => sellerAccounts.userId, { onDelete: 'restrict' }),
    status: payoutStatus('status').notNull().default('pending'),
    processedAt: timestamp('processed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('idx_seller_payout_seller_id').on(t.sellerId),
    index('idx_seller_payout_order_item_id').on(t.orderItemId),
  ],
);
