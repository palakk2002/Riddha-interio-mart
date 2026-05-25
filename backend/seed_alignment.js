require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./src/models/Product');
const Brand = require('./src/models/Brand');

// Guard against accidental production execution
require('./src/utils/seederGuard')('seed_alignment.js');

const seedAlignment = async () => {
  try {
    // Force Google DNS for resolution if MONGODB_DNS_SERVERS is active
    if (process.env.MONGODB_DNS_SERVERS) {
      const dns = require('dns');
      dns.setServers(process.env.MONGODB_DNS_SERVERS.split(','));
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for product-category alignment...');

    // 1. Ensure we have a default brand
    let brand = await Brand.findOne();
    if (!brand) {
      brand = await Brand.create({ name: 'StoneAge', image: 'dummy.jpg', isActive: true });
      console.log('Created default Brand: "StoneAge"');
    }

    // 2. Create or update products to align with specific subcategories
    const productsToSeed = [
      {
        name: 'Traditional Terracotta Tile',
        description: 'Earthy, rustic traditional terracotta clay tile perfect for indoor/outdoor patios.',
        price: 120,
        category: 'Flooring',
        subcategory: 'Terracotta Tiles',
        brand: brand._id,
        sku: 'FLO-TER-001',
        hsnCode: '6802',
        countInStock: 250,
        images: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80'],
        seller: brand._id,
        sellerType: 'Admin',
        isApproved: true,
        approvalStatus: 'approved',
        isActive: true
      },
      {
        name: 'Polished Vitrified Tile',
        description: 'Premium ultra-glossy vitrified flooring tiles with marble veins.',
        price: 180,
        category: 'Flooring',
        subcategory: 'Vitrified Tiles',
        brand: brand._id,
        sku: 'FLO-VIT-001',
        hsnCode: '6802',
        countInStock: 400,
        images: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80'],
        seller: brand._id,
        sellerType: 'Admin',
        isApproved: true,
        approvalStatus: 'approved',
        isActive: true
      },
      {
        name: 'Carrara Marble Slab',
        description: 'Exquisite polished Carrara white marble slab imported directly from Italian quarries.',
        price: 320,
        category: 'Flooring',
        subcategory: 'Carrara Marble',
        brand: brand._id,
        sku: 'FLO-CAR-001',
        hsnCode: '6802',
        countInStock: 80,
        images: ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80'],
        seller: brand._id,
        sellerType: 'Admin',
        isApproved: true,
        approvalStatus: 'approved',
        isActive: true
      }
    ];

    for (const p of productsToSeed) {
      const exists = await Product.findOne({ name: p.name });
      if (!exists) {
        await Product.create(p);
        console.log(`Seeded alignment product: "${p.name}"`);
      } else {
        // Keep category/subcategory updated if it exists
        exists.category = p.category;
        exists.subcategory = p.subcategory;
        await exists.save();
        console.log(`Aligned category and subcategory for: "${p.name}"`);
      }
    }

    // 3. Update any existing products whose names match the subcategories
    await Product.updateMany({ name: /Terracotta/i }, { $set: { category: 'Flooring', subcategory: 'Terracotta Tiles' } });
    await Product.updateMany({ name: /Vitrified/i }, { $set: { category: 'Flooring', subcategory: 'Vitrified Tiles' } });
    await Product.updateMany({ name: /Carrara/i }, { $set: { category: 'Flooring', subcategory: 'Carrara Marble' } });
    console.log('Batch updated name-based matching products.');

    console.log('Database alignment complete.');
    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Database Alignment Startup Error:', err.message);
    process.exit(1);
  }
};

seedAlignment();
