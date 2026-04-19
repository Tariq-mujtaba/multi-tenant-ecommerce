import { db } from '../client';
import { categories } from '../schema';

const TOP_LEVEL = [
  { name: 'electronics', displayName: 'Electronics', color: '#7A83FF' },
  { name: 'apparel', displayName: 'Apparel', color: '#FF6B35' },
  { name: 'home-living', displayName: 'Home & Living', color: '#00D696' },
  { name: 'accessories', displayName: 'Accessories', color: '#FFBF00' },
  { name: 'food-drink', displayName: 'Food & Drink', color: '#0099FF' },
  { name: 'books', displayName: 'Books & Media', color: '#FF7A05' },
  { name: 'beauty-health', displayName: 'Beauty & Health', color: '#FF85A1' },
  {
    name: 'sports-outdoors',
    displayName: 'Sports & Outdoors',
    color: '#4CAF50',
  },
  { name: 'toys-games', displayName: 'Toys & Games', color: '#FF5252' },
  { name: 'pet-supplies', displayName: 'Pet Supplies', color: '#795548' },
];

const CHILDREN: Record<string, { name: string; displayName: string }[]> = {
  electronics: [
    { name: 'smartphones', displayName: 'Smartphones' },
    { name: 'laptops', displayName: 'Laptops' },
    { name: 'audio', displayName: 'Audio & Headphones' },
    { name: 'tablets', displayName: 'Tablets' },
    { name: 'cameras', displayName: 'Cameras' },
    { name: 'gaming', displayName: 'Gaming' },
    { name: 'wearables', displayName: 'Wearables' },
  ],
  apparel: [
    { name: 't-shirts', displayName: 'T-Shirts' },
    { name: 'outerwear', displayName: 'Outerwear' },
    { name: 'footwear', displayName: 'Footwear' },
    { name: 'dresses', displayName: 'Dresses' },
    { name: 'trousers', displayName: 'Trousers & Jeans' },
    { name: 'activewear', displayName: 'Activewear' },
    { name: 'underwear', displayName: 'Underwear & Socks' },
  ],
  'home-living': [
    { name: 'kitchen', displayName: 'Kitchen' },
    { name: 'furniture', displayName: 'Furniture' },
    { name: 'decor', displayName: 'Decor' },
    { name: 'bedding', displayName: 'Bedding & Bath' },
    { name: 'lighting', displayName: 'Lighting' },
    { name: 'storage', displayName: 'Storage & Organisation' },
  ],
  accessories: [
    { name: 'bags', displayName: 'Bags & Wallets' },
    { name: 'jewellery', displayName: 'Jewellery' },
    { name: 'watches', displayName: 'Watches' },
    { name: 'sunglasses', displayName: 'Sunglasses' },
    { name: 'hats-caps', displayName: 'Hats & Caps' },
    { name: 'belts', displayName: 'Belts' },
  ],
  'food-drink': [
    { name: 'coffee-tea', displayName: 'Coffee & Tea' },
    { name: 'snacks', displayName: 'Snacks' },
    { name: 'chocolate-sweets', displayName: 'Chocolate & Sweets' },
    { name: 'organic', displayName: 'Organic & Natural' },
    { name: 'beverages', displayName: 'Beverages' },
  ],
  books: [
    { name: 'fiction', displayName: 'Fiction' },
    { name: 'non-fiction', displayName: 'Non-Fiction' },
    { name: 'digital-media', displayName: 'Digital Media' },
    { name: 'textbooks', displayName: 'Textbooks' },
    { name: 'comics-manga', displayName: 'Comics & Manga' },
  ],
  'beauty-health': [
    { name: 'skincare', displayName: 'Skincare' },
    { name: 'haircare', displayName: 'Hair Care' },
    { name: 'makeup', displayName: 'Makeup' },
    { name: 'fragrances', displayName: 'Fragrances' },
    { name: 'vitamins', displayName: 'Vitamins & Supplements' },
    { name: 'personal-care', displayName: 'Personal Care' },
  ],
  'sports-outdoors': [
    { name: 'gym-fitness', displayName: 'Gym & Fitness' },
    { name: 'cycling', displayName: 'Cycling' },
    { name: 'camping', displayName: 'Camping & Hiking' },
    { name: 'team-sports', displayName: 'Team Sports' },
    { name: 'water-sports', displayName: 'Water Sports' },
  ],
  'toys-games': [
    { name: 'board-games', displayName: 'Board Games' },
    { name: 'action-figures', displayName: 'Action Figures' },
    { name: 'building-sets', displayName: 'Building Sets' },
    { name: 'outdoor-play', displayName: 'Outdoor Play' },
    { name: 'educational-toys', displayName: 'Educational Toys' },
  ],
  'pet-supplies': [
    { name: 'dog', displayName: 'Dog' },
    { name: 'cat', displayName: 'Cat' },
    { name: 'fish-aquatic', displayName: 'Fish & Aquatic' },
    { name: 'small-animals', displayName: 'Small Animals' },
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
