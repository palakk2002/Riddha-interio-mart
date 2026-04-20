const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load env vars
dotenv.config();

const connectDB = require('./src/config/db');
const Category = require('./src/models/Category');
const Product = require('./src/models/Product');
const Admin = require('./src/models/Admin');
const FavouriteSection = require('./src/models/FavouriteSection');

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const ART_DIR = 'C:\\Users\\Priyank\\.gemini\\antigravity\\brain\\0e5ca49a-fce9-45cd-8695-bb5f77161e81\\';

const seedData = [
  {
    category: { name: 'Living Room', image: 'cat_living_room_1776679376659.png' },
    products: [
      { name: 'Italian Leather Sofa', price: 125000, img: 'banner_living_room_1776675933725.png' },
      { name: 'Minimalist Coffee Table', price: 45000, img: 'promo_winter_cozy_1776678836372.png' }
    ]
  },
  {
    category: { name: 'Modular Kitchen', image: 'cat_kitchen_1776679407214.png' },
    products: [
      { name: 'Gold Series Tap', price: 12000, img: 'catalog_gold_tap_1776665422636.png' },
      { name: 'Granite Island Slab', price: 85000, img: 'catalog_granite_countertop_1776665477206.png' }
    ]
  },
  {
    category: { name: 'Premium Bedroom', image: 'banner_bedroom_1776676000846.png' },
    products: [
      { name: 'Teak Master Bed', price: 110000, img: 'catalog_teak_bed_1776665458069.png' },
      { name: 'Veneer Wall Panel', price: 3500, img: 'catalog_wall_panel_1776665441148.png' }
    ]
  },
  {
    category: { name: 'Artisan Dining', image: 'banner_dining_retry_1776676040718.png' },
    products: [
      { name: 'Oak Dining Set', price: 95000, img: 'promo_festive_sale_1776678791906.png' },
      { name: 'Crystal Chandelier', price: 28000, img: 'catalog_smart_lighting_1776665494317.png' }
    ]
  },
  {
    category: { name: 'Home Office', image: 'banner_office_retry_1776676068881.png' },
    products: [
      { name: 'Visionary Tech Desk', price: 55000, img: 'banner_office_retry_1776676068881.png' },
      { name: 'Ergonomic Workspace', price: 12000, img: 'promo_home_decor_1776678818475.png' }
    ]
  },
  {
    category: { name: 'Outdoor Luxury', image: 'promo_winter_cozy_1776678836372.png' },
    products: [
      { name: 'Scandi Patio Set', price: 65000, img: 'promo_winter_cozy_1776678836372.png' },
      { name: 'Garden Accent Light', price: 4500, img: 'catalog_smart_lighting_1776665494317.png' }
    ]
  },
  {
    category: { name: 'Bath & Wellness', image: 'catalog_gold_tap_1776665422636.png' },
    products: [
      { name: 'Spa Shower System', price: 18000, img: 'catalog_gold_tap_1776665422636.png' },
      { name: 'Marble Vanity Top', price: 22000, img: 'inv_granite_slab_1776666529849.png' }
    ]
  },
  {
    category: { name: 'Art & Sculptures', image: 'promo_home_decor_1776678818475.png' },
    products: [
      { name: 'Geometric Gallery Art', price: 15000, img: 'promo_home_decor_1776678818475.png' },
      { name: 'Sculptural Lamp', price: 8500, img: 'catalog_smart_lighting_1776665494317.png' }
    ]
  }
];

const seedFavourites = async () => {
  try {
    await connectDB();
    console.log('MongoDB Connected...');

    // Find or create admin
    let admin = await Admin.findOne({ email: 'admin@riddha.com' });
    if (!admin) {
      admin = await Admin.create({
        fullName: 'Super Admin',
        email: 'admin@riddha.com',
        phone: '1234567890',
        password: 'adminpassword',
        role: 'superadmin'
      });
    }

    // Clear existing
    await FavouriteSection.deleteMany();
    console.log('Cleared existing Favourite Sections.');

    const sectionItems = [];

    for (const item of seedData) {
      console.log(`Processing Category: ${item.category.name}...`);
      
      // Upload Category Image
      const catUpload = await cloudinary.uploader.upload(path.join(ART_DIR, item.category.image), {
        folder: 'riddha_categories'
      });

      // Create/Update Category
      let category = await Category.findOne({ name: item.category.name });
      if (!category) {
        category = await Category.create({
          name: item.category.name,
          image: catUpload.secure_url,
          isActive: true
        });
      } else {
        category.image = catUpload.secure_url;
        await category.save();
      }

      const productIds = [];

      for (const p of item.products) {
        console.log(`  Uploading Product: ${p.name}...`);
        
        const pUpload = await cloudinary.uploader.upload(path.join(ART_DIR, p.img), {
          folder: 'riddha_products'
        });

        const product = await Product.create({
          name: p.name,
          description: `Premium ${p.name} designed with luxury and comfort in mind. Part of our exclusive Riddha Mart collection.`,
          price: p.price,
          category: category.name,
          brand: 'Riddha Originals',
          images: [pUpload.secure_url],
          countInStock: 50,
          seller: admin._id,
          sellerType: 'Admin',
          isApproved: true,
          approvalStatus: 'approved',
          isActive: true
        });

        productIds.push(product._id);
      }

      sectionItems.push({
        categoryId: category._id,
        productIds: productIds
      });
    }

    // Create the Favourite Section
    await FavouriteSection.create({
      heading: 'Designer Favorites',
      subheading: 'Our most loved collections, curated by top interior experts.',
      displayOrder: 1,
      isActive: true,
      items: sectionItems
    });

    console.log('Favourite Section with 8 categories and 16 products seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Error seeding favourites:', err);
    process.exit(1);
  }
};

seedFavourites();
