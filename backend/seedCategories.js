const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
const Category = require('./src/models/Category');

// Force use of Google DNS for SRV resolution
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load environment variables
dotenv.config();

const categories = [
  {
    name: 'Carrara Marble',
    description: 'Classic luxury white marble with delicate grey veining, perfect for elegant floors and walls.',
    image: 'https://res.cloudinary.com/dfrie9np4/image/upload/v1776928819/riddha_mart/categories/carrara_marble_icon.jpg',
    subcategories: [{ name: 'Polished' }, { name: 'Honed' }]
  },
  {
    name: 'Vitrified Tiles',
    description: 'Durable, low-maintenance tiles with a mirror-like polished finish, ideal for high-traffic living areas.',
    image: 'https://res.cloudinary.com/dfrie9np4/image/upload/v1776928829/riddha_mart/categories/vitrified_tiles_icon.jpg',
    subcategories: [{ name: 'Double Charged' }, { name: 'Nano Polished' }]
  },
  {
    name: 'Granite Flooring',
    description: 'Extremely tough natural stone floors with shimmering speckles, perfect for kitchens and hallways.',
    image: 'https://res.cloudinary.com/dfrie9np4/image/upload/v1776928847/riddha_mart/categories/granite_flooring_icon.jpg',
    subcategories: [{ name: 'Black Galaxy' }, { name: 'Imperial Red' }]
  },
  {
    name: 'Travertine Tiles',
    description: 'Natural porous stone with warm earthy tones, bringing a rustic yet sophisticated feel to any space.',
    image: 'https://res.cloudinary.com/dfrie9np4/image/upload/v1776928866/riddha_mart/categories/travertine_tiles_icon.jpg',
    subcategories: [{ name: 'Silver Travertine' }, { name: 'Beige Honed' }]
  },
  {
    name: 'Porcelain Tiles',
    description: 'Highly dense and frost-resistant tiles, perfect for both indoor and outdoor heavy-duty applications.',
    image: 'https://res.cloudinary.com/dfrie9np4/image/upload/v1776928881/riddha_mart/categories/porcelain_tiles_icon.jpg',
    subcategories: [{ name: 'Matte Finish' }, { name: 'Rustic Series' }]
  },
  {
    name: 'Ceramic Wall Tiles',
    description: 'Lightweight and stylish tiles specifically designed for bathroom and kitchen walls.',
    image: 'https://res.cloudinary.com/dfrie9np4/image/upload/v1776928888/riddha_mart/categories/ceramic_wall_tiles_icon.jpg',
    subcategories: [{ name: 'Glossy Finish' }, { name: '3D Texture' }]
  },
  {
    name: 'Slate Stone',
    description: 'Natural split-face stone with a unique layered texture, ideal for feature walls and outdoor patios.',
    image: 'https://res.cloudinary.com/dfrie9np4/image/upload/v1776928918/riddha_mart/categories/slate_stone_icon.jpg',
    subcategories: [{ name: 'Black Slate' }, { name: 'Multi-Color Slate' }]
  },
  {
    name: 'Mosaic & Highlighters',
    description: 'Intricate decorative tiles used to create stunning patterns and accent walls in modern interiors.',
    image: 'https://res.cloudinary.com/dfrie9np4/image/upload/v1776929241/riddha_mart/categories/mosaic___highlighters_icon.jpg',
    subcategories: [{ name: 'Glass Mosaic' }, { name: 'Stone Highlighters' }]
  },
  {
    name: 'Wooden Plank Tiles',
    description: 'Tiles that replicate the natural beauty of hardwood floors without the maintenance headaches.',
    image: 'https://res.cloudinary.com/dfrie9np4/image/upload/v1776928961/riddha_mart/categories/wooden_plank_tiles_icon.jpg',
    subcategories: [{ name: 'Oak Texture' }, { name: 'Walnut Finish' }]
  },
  {
    name: 'Terracotta Tiles',
    description: 'Traditional handmade clay tiles that offer a warm, earthy Mediterranean aesthetic.',
    image: 'https://res.cloudinary.com/dfrie9np4/image/upload/v1776928976/riddha_mart/categories/terracotta_tiles_icon.jpg',
    subcategories: [{ name: 'Hexagon Pattern' }, { name: 'Square Traditional' }]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for final seeding...');

    for (const cat of categories) {
      await Category.findOneAndUpdate(
        { name: cat.name },
        cat,
        { upsert: true, new: true }
      );
    }

    console.log('10 Categories updated with ultra-premium photorealistic images!');
    process.exit();
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
};

seedDB();
