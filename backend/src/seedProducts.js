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
        name: 'Italian Granite Slab - Polished',
        sku: 'STN-GRA-05',
        brand: 'StoneAge',
        category: 'Tiles',
        price: 95,
        countInStock: 25,
        description: 'Premium Italian granite slab with a highly polished mirror finish.',
        images: ['/uploads/inventory/granite_slab.png'],
        seller: admin._id,
        sellerType: 'Admin',
        isApproved: true,
        approvalStatus: 'approved',
        isActive: true
      },
      {
        name: 'Frameless Glass Shower Door',
        sku: 'SAN-SHO-01',
        brand: 'PureWater',
        category: 'Sanitary',
        price: 850,
        countInStock: 15,
        description: 'Tempered frameless glass shower door with chrome hardware.',
        images: ['https://images.unsplash.com/photo-1620626011761-9963d7b59675?auto=format&fit=crop&q=80&w=600'],
        seller: admin._id,
        sellerType: 'Admin',
        isApproved: true,
        approvalStatus: 'approved',
        isActive: true
      },
      {
        name: 'Smart WiFi Thermostat',
        sku: 'ELC-THR-08',
        brand: 'LightSync',
        category: 'Electricals',
        price: 180,
        countInStock: 50,
        description: 'Advanced smart thermostat with app control and energy saving features.',
        images: ['https://images.unsplash.com/photo-1567928223611-37d4f9b8b082?auto=format&fit=crop&q=80&w=600'],
        seller: admin._id,
        sellerType: 'Admin',
        isApproved: true,
        approvalStatus: 'approved',
        isActive: true
      },
      {
        name: 'Industrial Pendant Light - Black',
        sku: 'LGT-PEN-04',
        brand: 'DecoStruct',
        category: 'Electricals',
        price: 65,
        countInStock: 100,
        description: 'Sleek black industrial pendant light for modern kitchens or bars.',
        images: ['https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=600'],
        seller: admin._id,
        sellerType: 'Admin',
        isApproved: true,
        approvalStatus: 'approved',
        isActive: true
      },
      {
        name: 'Designer Door Handle Set',
        sku: 'HRD-HAN-02',
        brand: 'LuxUrban',
        category: 'Hardware',
        price: 45,
        countInStock: 200,
        description: 'Minimalist designer door handle set in brushed nickel.',
        images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600'],
        seller: admin._id,
        sellerType: 'Admin',
        isApproved: true,
        approvalStatus: 'approved',
        isActive: true
      },
      {
        name: 'Gold Ornate Wall Mirror',
        sku: 'DEC-MIR-12',
        brand: 'HeritageWood',
        category: 'Decor',
        price: 320,
        countInStock: 12,
        description: 'Large ornate gold-framed wall mirror for classic interiors.',
        images: ['https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=600'],
        seller: admin._id,
        sellerType: 'Admin',
        isApproved: true,
        approvalStatus: 'approved',
        isActive: true
      },
      {
        name: 'Quartz Undermount Kitchen Sink',
        sku: 'SAN-SNK-05',
        brand: 'AquaLux',
        category: 'Sanitary',
        price: 420,
        countInStock: 30,
        description: 'Durable charcoal grey quartz kitchen sink, undermount style.',
        images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600'],
        seller: admin._id,
        sellerType: 'Admin',
        isApproved: true,
        approvalStatus: 'approved',
        isActive: true
      },
      {
        name: 'Scandinavian Oak Dining Table',
        sku: 'FUR-TAB-01',
        brand: 'FloorMaster',
        category: 'Furniture',
        price: 1250,
        countInStock: 8,
        description: '6-seater dining table made from premium light oak wood.',
        images: ['https://images.unsplash.com/photo-1577146333332-9017646da0f8?auto=format&fit=crop&q=80&w=600'],
        seller: admin._id,
        sellerType: 'Admin',
        isApproved: true,
        approvalStatus: 'approved',
        isActive: true
      },
      {
        name: 'Premium Wool Carpet - Slate',
        sku: 'WOD-CAR-09',
        brand: 'TextureTouch',
        category: 'Flooring',
        price: 35,
        countInStock: 500,
        description: 'Soft wool carpet with a dense pile in elegant slate grey. Price per sqft.',
        images: ['https://images.unsplash.com/photo-1518131343773-455799757f49?auto=format&fit=crop&q=80&w=600'],
        seller: admin._id,
        sellerType: 'Admin',
        isApproved: true,
        approvalStatus: 'approved',
        isActive: true
      },
      {
        name: 'Outdoor LED Garden Spotlight',
        sku: 'LGT-OUT-03',
        brand: 'LightSync',
        category: 'Electricals',
        price: 85,
        countInStock: 80,
        description: 'Waterproof adjustable LED spotlight for landscape lighting.',
        images: ['https://images.unsplash.com/photo-1507473885765-e6ed657f9971?auto=format&fit=crop&q=80&w=600'],
        seller: admin._id,
        sellerType: 'Admin',
        isApproved: true,
        approvalStatus: 'approved',
        isActive: true
      }
    ];

    await Product.deleteMany({ sellerType: 'Admin' });
    await Product.insertMany(sampleProducts);
    
    console.log('10 Inventory products seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
