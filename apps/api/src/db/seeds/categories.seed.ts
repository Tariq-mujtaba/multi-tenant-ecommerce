import { db } from '../client';
import { categories } from '../schema';

const TOP_LEVEL = [
  { name: 'electronics', displayName: 'Electronics', color: '#7A83FF' },
  { name: 'apparel', displayName: 'Apparel', color: '#FF6B35' },
  { name: 'home-living', displayName: 'Home & Living', color: '#00D696' },
  { name: 'accessories', displayName: 'Accessories', color: '#FFBF00' },
  { name: 'food-drink', displayName: 'Food & Drink', color: '#0099FF' },
  { name: 'books', displayName: 'Books & Media', color: '#FF7A05' },
];

const CHILDREN: Record<string, { name: string; displayName: string }[]> = {
  electronics: [
    { name: 'smartphones', displayName: 'Smartphones' },
    { name: 'laptops', displayName: 'Laptops' },
    { name: 'audio', displayName: 'Audio & Headphones' },
  ],
  apparel: [
    { name: 't-shirts', displayName: 'T-Shirts' },
    { name: 'outerwear', displayName: 'Outerwear' },
    { name: 'footwear', displayName: 'Footwear' },
  ],
  'home-living': [
    { name: 'kitchen', displayName: 'Kitchen' },
    { name: 'furniture', displayName: 'Furniture' },
    { name: 'decor', displayName: 'Decor' },
  ],
  accessories: [
    { name: 'bags', displayName: 'Bags & Wallets' },
    { name: 'jewellery', displayName: 'Jewellery' },
    { name: 'watches', displayName: 'Watches' },
  ],
  'food-drink': [
    { name: 'coffee-tea', displayName: 'Coffee & Tea' },
    { name: 'snacks', displayName: 'Snacks' },
  ],
  books: [
    { name: 'fiction', displayName: 'Fiction' },
    { name: 'non-fiction', displayName: 'Non-Fiction' },
    { name: 'digital-media', displayName: 'Digital Media' },
  ],
};

export async function seedCategories() {
  console.log('  Seeding categories...');

  const inserted = await db
    .insert(categories)
    .values(TOP_LEVEL.map((c) => ({ ...c, parentId: null })))
    .onConflictDoNothing()
    .returning({ id: categories.id, name: categories.name });

  const parentMap: Record<string, string> = {};
  for (const row of inserted) {
    parentMap[row.name] = row.id;
  }

  // Fetch any parents that already existed (conflict → not returned)
  const missingNames = TOP_LEVEL.map((c) => c.name).filter(
    (n) => !parentMap[n],
  );
  if (missingNames.length > 0) {
    const existing = await db
      .select({ id: categories.id, name: categories.name })
      .from(categories);
    for (const row of existing) {
      if (missingNames.includes(row.name)) parentMap[row.name] = row.id;
    }
  }

  const childRows = Object.entries(CHILDREN).flatMap(([parentName, kids]) => {
    const parentId = parentMap[parentName];
    if (!parentId) return [];
    return kids.map((k) => ({ ...k, color: null, parentId }));
  });

  if (childRows.length > 0) {
    await db.insert(categories).values(childRows).onConflictDoNothing();
  }

  console.log(
    `  ✓ ${inserted.length} top-level categories, ${childRows.length} sub-categories`,
  );
}
