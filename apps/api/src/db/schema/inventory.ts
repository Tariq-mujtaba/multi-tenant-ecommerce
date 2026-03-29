import { pgTable, uuid, integer, timestamp } from 'drizzle-orm/pg-core';
import { productVariants } from './products';

export const inventory = pgTable('inventory', {
  id: uuid('id').primaryKey().defaultRandom(),
  stock: integer('stock').notNull().default(0),
  reservedStock: integer('reserved_stock').notNull().default(0),
  variantId: uuid('variant_id')
    .notNull()
    .unique()
    .references(() => productVariants.id, { onDelete: 'cascade' }),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
