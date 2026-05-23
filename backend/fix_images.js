const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./src/models/Product');
const connectDB = require('./src/config/db');

connectDB().then(async () => {
  try {
    console.log('Fixing via.placeholder.com URLs to placehold.co...');
    const products = await Product.find({ images: { $regex: 'via.placeholder.com' } });
    
    let count = 0;
    for (const product of products) {
      if (product.images && product.images.length > 0) {
        product.images = product.images.map(img => 
          img.replace(/via\.placeholder\.com/g, 'placehold.co')
        );
        await product.save();
        count++;
      }
    }

    console.log(`Updated ${count} products successfully.`);
    process.exit(0);
  } catch (err) {
    console.error('Error updating images:', err);
    process.exit(1);
  }
});
