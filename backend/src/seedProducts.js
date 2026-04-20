require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

const seedProducts = async () => {
  try {
    await connectDB();
    
    // Find an admin to be the owner
    const admin = await Admin.findOne({ email: 'admin@riddha.com' }) || await Admin.findOne({});
    if (!admin) {
      console.error('No admin found to own products. Please create an admin first.');
      process.exit(1);
    }

    const sampleProducts = [
      {
        name: 'Velvet Sofa - Royal Blue',
        sku: 'SOF-BLU-01',
        brand: 'LuxUrban',
        category: 'Furniture',
        price: 1200,
        countInStock: 5,
        description: 'Luxurious royal blue velvet sofa for your living room.',
        images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400'],
        seller: admin._id,
        sellerType: 'Admin',
        isApproved: true,
        approvalStatus: 'approved',
        isActive: true
      },
      {
        name: 'Industrial Hanging Light',
        sku: 'LGT-IND-05',
        brand: 'LightEra',
        category: 'Electricals',
        price: 85,
        countInStock: 50,
        description: 'Vintage industrial style hanging light for modern kitchens.',
        images: ['https://images.unsplash.com/photo-1507473885765-e6ed657f9971?auto=format&fit=crop&q=80&w=400'],
        seller: admin._id,
        sellerType: 'Admin',
        isApproved: false,
        approvalStatus: 'pending',
        isActive: true
      }
    ];

    await Product.deleteMany({ sellerType: 'Admin' });
    await Product.insertMany(sampleProducts);
    
    console.log('Sample products seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
