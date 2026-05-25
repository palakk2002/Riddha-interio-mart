require('dotenv').config();
const { execSync } = require('child_process');
const path = require('path');

// Guard against accidental production database execution
require('./src/utils/seederGuard')('seed.js');

const runScript = (scriptName) => {
  console.log(`\n----------------------------------------------------------------------`);
  console.log(`[SEED MASTER] Launching: ${scriptName}...`);
  console.log(`----------------------------------------------------------------------`);
  try {
    // Execute child process sharing stdio for real-time terminal output
    execSync(`node "${path.join(__dirname, scriptName)}"`, { stdio: 'inherit' });
    console.log(`[SEED MASTER] ${scriptName} finished successfully.`);
  } catch (err) {
    console.error(`\n[SEED MASTER ERROR] Script "${scriptName}" encountered a failure.`);
    console.error(`Aborting subsequent seeding sequences to maintain database integrity.\n`);
    process.exit(1);
  }
};

const main = () => {
  console.log(`\n======================================================================`);
  console.log(`[SEED MASTER] Starting Secure MERN Database Seeding Orchestrator`);
  console.log(`======================================================================`);

  // 1. Core user defaults (Superadmin, base Customer)
  runScript('seed_defaults.js');

  // 2. Primary taxonomies (Categories, Brands, Catalog Structure)
  runScript('seedCategories.js');
  runScript('seed_brands.js');
  runScript('seed_catalog.js');

  // 3. Operational profiles (Delivery drivers)
  runScript('seed_deliveries.js');

  // 4. Products & Catalog Alignments
  runScript('seed_seller_products.js');
  runScript('seed_alignment.js');

  // 5. Visual assets and sections (Banners, Favourites, New arrivals)
  runScript('seed_banners.js');
  runScript('seed_promo_banners.js');
  runScript('seed_favourites.js');
  runScript('seed_new_arrivals.js');

  console.log(`\n======================================================================`);
  console.log(`[SEED MASTER] Complete! Database is fully configured and ready for dev.`);
  console.log(`======================================================================\n`);
  process.exit(0);
};

main();
