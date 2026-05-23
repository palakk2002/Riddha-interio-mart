require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./src/models/Product');
const Category = require('./src/models/Category');

async function fixPlaceholders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/riddha-interio-mart', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    const products = await Product.find({ 'images': { $regex: 'via.placeholder.com' } });
    let count = 0;
    
    for (const product of products) {
      product.images = product.images.map(img => {
        if (img.includes('via.placeholder.com')) {
          return img.replace('via.placeholder.com', 'placehold.co').replace('.png', '');
        }
        return img;
      });
      await product.save();
      count++;
    }
    
    console.log(`Updated ${count} products.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixPlaceholders();
