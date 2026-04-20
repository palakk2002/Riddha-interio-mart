const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load env vars
dotenv.config();

const connectDB = require('./src/config/db');
const HomeBanner = require('./src/models/HomeBanner');

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const bannerData = [
  {
    title: 'Architectural Elegance',
    subtitle: 'Redefining luxury living spaces with bespoke Italian craftsmanship and modern design sensibilities.',
    localPath: 'C:\\Users\\Priyank\\.gemini\\antigravity\\brain\\0e5ca49a-fce9-45cd-8695-bb5f77161e81\\banner_living_room_1776675933725.png',
    primaryBtnText: 'Shop Living',
    primaryBtnLink: '/categories/living-room'
  },
  {
    title: 'The Intelligent Kitchen',
    subtitle: 'Experience the future of culinary art with our smart modular kitchens, matte finishes, and ergonomic flow.',
    localPath: 'C:\\Users\\Priyank\\.gemini\\antigravity\\brain\\0e5ca49a-fce9-45cd-8695-bb5f77161e81\\banner_kitchen_1776675961171.png',
    primaryBtnText: 'Kitchen Design',
    primaryBtnLink: '/categories/modular-kitchen'
  },
  {
    title: 'Serene Sanctuary',
    subtitle: 'Your bedroom is your private retreat. Transform it with our handcrafted teak wood collections and soft velvet textiles.',
    localPath: 'C:\\Users\\Priyank\\.gemini\\antigravity\\brain\\0e5ca49a-fce9-45cd-8695-bb5f77161e81\\banner_bedroom_1776676000846.png',
    primaryBtnText: 'Bed Collections',
    primaryBtnLink: '/categories/bedroom'
  },
  {
    title: 'Artistic Dining',
    subtitle: 'Make every meal an occasion with massive solid oak tables and sculptural lighting that sparks conversation.',
    localPath: 'C:\\Users\\Priyank\\.gemini\\antigravity\\brain\\0e5ca49a-fce9-45cd-8695-bb5f77161e81\\banner_dining_retry_1776676040718.png',
    primaryBtnText: 'Dining Sets',
    primaryBtnLink: '/categories/dining-room'
  },
  {
    title: 'Timeless Intellect',
    subtitle: 'A home office designed for visionaries. Iconic mid-century modern pieces paired with floor-to-ceiling libraries.',
    localPath: 'C:\\Users\\Priyank\\.gemini\\antigravity\\brain\\0e5ca49a-fce9-45cd-8695-bb5f77161e81\\banner_office_retry_1776676068881.png',
    primaryBtnText: 'Home Office',
    primaryBtnLink: '/categories/office'
  }
];

const seedBanners = async () => {
  try {
    await connectDB();
    console.log('MongoDB Connected...');

    // Clear existing banners
    await HomeBanner.deleteMany();
    console.log('Existing banners cleared.');

    for (const data of bannerData) {
      console.log(`Uploading ${data.title}...`);
      
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(data.localPath, {
        folder: 'riddha_banners',
        use_filename: true,
        unique_filename: false
      });

      console.log(`Cloudinary Upload Success: ${result.secure_url}`);

      // Create Banner in DB
      await HomeBanner.create({
        title: data.title,
        subtitle: data.subtitle,
        bgImage: {
          src: result.secure_url,
          alt: data.title,
          caption: data.subtitle
        },
        primaryBtnText: data.primaryBtnText,
        primaryBtnLink: data.primaryBtnLink,
        secondaryBtnText: 'Consult Us',
        secondaryBtnLink: '/contact'
      });
      
      console.log(`DB Entry Created for ${data.title}`);
    }

    console.log('All banners seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Error seeding banners:', err);
    process.exit(1);
  }
};

seedBanners();
