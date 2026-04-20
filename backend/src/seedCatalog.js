require('dotenv').config();
const mongoose = require('mongoose');
const Catalog = require('./models/Catalog');
const connectDB = require('./config/db');

const catalogItems = [
  {
    name: 'Classic Marble Tile',
    sku: 'TLE-MAR-001',
    brand: 'Marbella',
    category: 'Tiles',
    price: 120,
    stock: 500,
    description: 'High-quality classic marble tile for premium interiors.',
    images: ['https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80&w=400'],
    material: 'Natural Marble',
    dimensions: '60x60 cm'
  },
  {
    name: 'Dusty Rose Matte Paint',
    sku: 'PNT-ROS-45',
    brand: 'ColorLux',
    category: 'Paints',
    price: 45,
    stock: 200,
    description: 'Durable matte finish paint in a sophisticated dusty rose shade.',
    images: ['https://images.unsplash.com/photo-1562624232-a5e22709219e?auto=format&fit=crop&q=80&w=400'],
    material: 'Acrylic Emulsion',
    dimensions: '5 Liters'
  },
  {
    name: 'Oak Wood Coffee Table',
    sku: 'FUR-OAK-350',
    brand: 'RusticHome',
    category: 'Furniture',
    price: 350,
    stock: 20,
    description: 'Handcrafted solid oak wood coffee table with a natural finish.',
    images: ['https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&q=80&w=400'],
    material: 'Solid Oak',
    dimensions: '120x60x45 cm'
  },
  {
    name: 'Geometric Accent Lamp',
    sku: 'ELE-GEO-65',
    brand: 'LightEra',
    category: 'Electricals',
    price: 65,
    stock: 100,
    description: 'Modern geometric accent lamp with warm LED lighting.',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed657f9971?auto=format&fit=crop&q=80&w=400'],
    material: 'Metal & Glass',
    dimensions: '15x15x30 cm'
  }
];

const seedData = async () => {
  try {
    await connectDB();
    
    // Delete existing to start fresh for the user
    await Catalog.deleteMany({});
    console.log('Existing catalog data cleared.');

    await Catalog.insertMany(catalogItems);
    console.log('Catalog seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding catalog:', error);
    process.exit(1);
  }
};

seedData();
