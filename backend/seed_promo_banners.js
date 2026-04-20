const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load env vars
dotenv.config();

const connectDB = require('./src/config/db');
const PromoBanner = require('./src/models/PromoBanner');

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const promoData = [
  {
    title: 'Festive Grandeur Sale',
    subtitle: 'Flat 25% Off on our Royal Indian Heritage collection. Bring home the gold-standard of interior art.',
    localPath: 'C:\\Users\\Priyank\\.gemini\\antigravity\\brain\\0e5ca49a-fce9-45cd-8695-bb5f77161e81\\promo_festive_sale_1776678791906.png',
    ctaText: 'Shop Sale',
    ctaLink: '/offers/festive'
  },
  {
    title: 'Curated Decor Pieces',
    subtitle: 'Small details make a big difference. Explore our new minimalist accessories today.',
    localPath: 'C:\\Users\\Priyank\\.gemini\\antigravity\\brain\\0e5ca49a-fce9-45cd-8695-bb5f77161e81\\promo_home_decor_1776678818475.png',
    ctaText: 'Browse Decor',
    ctaLink: '/categories/accessories'
  },
  {
    title: 'The Winter Comforts',
    subtitle: 'Stay cozy with our premium velvet throws and dark oak furniture. Up to 40% off on winter essentials.',
    localPath: 'C:\\Users\\Priyank\\.gemini\\antigravity\\brain\\0e5ca49a-fce9-45cd-8695-bb5f77161e81\\promo_winter_cozy_1776678836372.png',
    ctaText: 'Get Cozy',
    ctaLink: '/offers/winter'
  }
];

const seedPromoBanners = async () => {
  try {
    await connectDB();
    console.log('MongoDB Connected...');

    // Clear existing promo banners
    await PromoBanner.deleteMany();
    console.log('Existing promo banners cleared.');

    for (const data of promoData) {
      console.log(`Uploading Promo: ${data.title}...`);
      
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(data.localPath, {
        folder: 'riddha_promos',
        use_filename: true,
        unique_filename: false
      });

      console.log(`Cloudinary Upload Success: ${result.secure_url}`);

      // Create Promo Banner in DB
      await PromoBanner.create({
        title: data.title,
        subtitle: data.subtitle,
        image: result.secure_url,
        ctaText: data.ctaText,
        ctaLink: data.ctaLink
      });
      
      console.log(`DB Entry Created for Promo Header: ${data.title}`);
    }

    console.log('All promo banners seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Error seeding promo banners:', err);
    process.exit(1);
  }
};

seedPromoBanners();
