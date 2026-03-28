import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { sellerAccountStatus } from './enums';
import { users } from './users';

export const sellerAccounts = pgTable('seller_account', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  slug: text('slug').notNull().unique(),
  heading: text('heading').notNull(),
  desc: text('desc').notNull(),
  status: sellerAccountStatus('status').notNull().default('draft'),
  approvedAt: timestamp('approved_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
