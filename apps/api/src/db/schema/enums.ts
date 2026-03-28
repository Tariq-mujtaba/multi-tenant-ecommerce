import { pgEnum } from 'drizzle-orm/pg-core';

export const sellerAccountStatus = pgEnum('seller_account_status', [
  'draft',
  'pending',
  'approved',
  'rejected',
]);

export const productStatus = pgEnum('product_status', [
  'draft',
  'active',
  'archived',
]);

export const orderStatus = pgEnum('order_status', [
  'pending',
  'paid',
  'cancelled',
]);

export const orderItemStatus = pgEnum('order_item_status', [
  'pending',
  'dispatched',
  'delayed',
  'delivered',
  'cancelled',
]);

export const paymentStatus = pgEnum('payment_status', [
  'pending',
  'success',
  'failed',
]);

export const payoutStatus = pgEnum('payout_status', [
  'pending',
  'processing',
  'sent',
  'failed',
]);
