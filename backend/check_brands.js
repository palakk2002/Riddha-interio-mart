const mongoose = require('mongoose');
const Brand = require('./src/models/Brand');
require('dotenv').config();

const checkBrands = async () => {
  try {
    if (!process.env.MONGODB_URI) {
       console.error('MONGODB_URI not found in .env');
       process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    const brands = await Brand.find({});
    console.log('Brands found:', brands.length);
    brands.forEach(b => console.log(`- ${b.name} (${b._id})`));
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

checkBrands();
