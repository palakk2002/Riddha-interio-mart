const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Product = require('./models/Product');

async function migrate() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    const res = await Product.updateMany(
      { sellerType: { $exists: false } },
      { $set: { sellerType: 'Admin' } }
    );

    console.log(`Successfully updated ${res.modifiedCount} products to sellerType: 'Admin'.`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
