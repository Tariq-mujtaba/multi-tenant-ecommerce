import 'dotenv/config';
import { seedCategories } from './categories.seed';

const seeds = [
  seedCategories,
  // add future seed functions here in order
];

async function main() {
  console.log('Running seeds...');
  for (const seed of seeds) {
    await seed();
  }
  console.log('All seeds complete.');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
