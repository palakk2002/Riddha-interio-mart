const mongoose = require('mongoose');
const Brand = require('./backend/src/models/Brand');
require('dotenv').config({ path: './backend/.env' });

const checkBrands = async () => {
  try {
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
