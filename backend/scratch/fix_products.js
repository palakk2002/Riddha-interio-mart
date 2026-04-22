const mongoose = require('mongoose');
require('dotenv').config();

const fixProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const Product = require('./src/models/Product');
    const Admin = require('./src/models/Admin');
    
    const admin = await Admin.findOne({});
    if (!admin) {
      console.error('No Admin found');
      process.exit(1);
    }
    
    const result = await Product.updateMany(
      { seller: { $exists: false } }, 
      { 
        $set: { 
          seller: admin._id, 
          sellerType: 'Admin', 
          isApproved: true, 
          approvalStatus: 'approved' 
        } 
      }
    );
    
    console.log(`Successfully updated ${result.modifiedCount} products with missing sellers.`);
    process.exit(0);
  } catch (err) {
    console.error('Fix failed:', err);
    process.exit(1);
  }
};

fixProducts();
