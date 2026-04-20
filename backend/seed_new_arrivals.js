const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./src/config/db');
const Product = require('./src/models/Product');
const Section = require('./src/models/Section');

const seedNewArrivals = async () => {
  try {
    await connectDB();
    console.log('MongoDB Connected...');

    // Find some products we recently created
    const products = await Product.find({ sellerType: 'Admin' }).limit(6);
    if (products.length === 0) {
      console.log('No products found to add to section.');
      process.exit();
    }

    const productIds = products.map(p => p._id);

    // Clear existing sections with this name
    await Section.deleteMany({ title: 'New Season Arrivals' });

    // Create New Section
    const section = await Section.create({
      title: 'New Season Arrivals',
      subtitle: 'Freshly curated pieces from our sustainable teak and marble collection.',
      displayType: 'product',
      displayOrder: 1,
      isActive: true,
      productIds: productIds
    });

    console.log(`Successfully created section: ${section.title} with ${productIds.length} products.`);
    process.exit();
  } catch (err) {
    console.error('Error seeding section:', err);
    process.exit(1);
  }
};

seedNewArrivals();
