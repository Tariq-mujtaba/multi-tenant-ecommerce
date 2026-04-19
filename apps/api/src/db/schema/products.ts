import {
  pgTable,
  uuid,
  text,
  timestamp,
  numeric,
  primaryKey,
  index,
} from 'drizzle-orm/pg-core';
import { productStatus } from './enums';
import { sellerAccounts } from './sellers';

export const products = pgTable(
  'product',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull().unique(),
    sellerId: uuid('seller_id')
      .notNull()
      .references(() => sellerAccounts.userId, { onDelete: 'cascade' }),
    status: productStatus('status').notNull().default('draft'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => [index('idx_product_seller_id').on(t.sellerId)],
);

export const categories = pgTable('category', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  displayName: text('display_name').notNull(),
  color: text('color'),
  parentId: uuid('parent_id').references((): any => categories.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const productCategories = pgTable(
  'product_category',
  {
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    categoryId: uuid('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),
  },
  (t) => [
    primaryKey({ columns: [t.productId, t.categoryId] }),
    index('idx_product_category_category_id').on(t.categoryId),
  ],
);

export const tags = pgTable('tag', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const productTags = pgTable(
  'product_tag',
  {
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (t) => [
    primaryKey({ columns: [t.productId, t.tagId] }),
    index('idx_product_tag_tag_id').on(t.tagId),
  ],
);

export const productVariants = pgTable(
  'product_variant',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    desc: text('desc').notNull(),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
    currency: text('currency').notNull(),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index('idx_product_variant_product_id').on(t.productId)],
);
