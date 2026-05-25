const fs = require('fs');
const path = require('path');

const seedFiles = [
  'seed_brands.js',
  'seed_catalog.js',
  'seed_defaults.js',
  'seed_deliveries.js',
  'seed_favourites.js',
  'seed_new_arrivals.js',
  'seed_promo_banners.js',
  'seed_seller_products.js'
];

seedFiles.forEach((file) => {
  const filePath = path.join(__dirname, '../', file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('seederGuard')) {
    console.log(`Already protected: ${file}`);
    return;
  }
  
  // Cleanly replace mongoose require at the very top of the file to include the guard
  content = `const mongoose = require('mongoose');\nrequire('./src/utils/seederGuard')('${file}');\n` + content.replace(/const mongoose = require\(['"]mongoose['"]\);?\r?\n?/, '');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully protected: ${file}`);
});
