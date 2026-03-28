import {
  pgTable,
  text,
  uuid,
  integer,
  boolean,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { productVariants } from './products';

export const media = pgTable(
  'media',
  {
    id: text('id').primaryKey(),
    url: text('url').notNull(),
    type: text('type').notNull(),
    fileName: text('file_name').notNull(),
    productVariantId: uuid('product_variant_id')
      .notNull()
      .references(() => productVariants.id, { onDelete: 'cascade' }),
    position: integer('position').notNull().default(0),
    isPrimary: boolean('is_primary').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index('idx_media_product_variant_id').on(t.productVariantId)],
);
