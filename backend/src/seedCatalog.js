require('dotenv').config();
const mongoose = require('mongoose');
const Catalog = require('./models/Catalog');
const connectDB = require('./config/db');

const seedCatalog = async () => {
  try {
    await connectDB();
    
    const sampleCatalog = [
      {
        name: 'Brushed Gold Kitchen Tap',
        sku: 'TAP-GLD-01',
        brand: 'AquaLux',
        category: 'Plumbing',
        price: 450,
        stock: 100,
        description: 'Premium brushed gold finish kitchen faucet with pull-out sprayer.',
        images: ['/uploads/catalog/gold_tap.png'],
        material: 'Brass',
        dimensions: 'Standard'
      },
      {
        name: '3D Geometric Wall Panel',
        sku: 'WAL-PAN-05',
        brand: 'DecoStruct',
        category: 'Tiles',
        price: 120,
        stock: 500,
        description: 'Modern 3D textured wall panels for a sophisticated architectural look.',
        images: ['/uploads/catalog/wall_panel.png'],
        material: 'PVC / Fibreglass',
        dimensions: '500x500mm'
      },
      {
        name: 'Handcrafted Teak Bed Frame',
        sku: 'BED-TEA-02',
        brand: 'HeritageWood',
        category: 'Furniture',
        price: 2500,
        stock: 10,
        description: 'Exquisite handcrafted teak wood bed frame with traditional carvings.',
        images: ['/uploads/catalog/teak_bed.png'],
        material: 'Solid Teak',
        dimensions: 'King Size'
      },
      {
        name: 'Premium Black Granite Slab',
        sku: 'STN-GRA-10',
        brand: 'StoneAge',
        category: 'Tiles',
        price: 85,
        stock: 200,
        description: 'Deep black granite with galaxy patterns, perfect for kitchen countertops.',
        images: ['/uploads/catalog/granite_countertop.png'],
        material: 'Granite',
        dimensions: 'Custom Size'
      },
      {
        name: 'Smart LED Ambient Panel',
        sku: 'LGT-SMR-08',
        brand: 'LightSync',
        category: 'Electricals',
        price: 199,
        stock: 150,
        description: 'App-controlled smart LED panels for dynamic home lighting.',
        images: ['/uploads/catalog/smart_lighting.png'],
        material: 'Plastic / Electronics',
        dimensions: 'Mixed Set'
      },
      {
        name: 'Italian Carrara Marble',
        sku: 'MAR-CAR-01',
        brand: 'VeronaStones',
        category: 'Tiles',
        price: 150,
        stock: 300,
        description: 'Classic white Italian Carrara marble with elegant grey veining.',
        images: ['https://images.unsplash.com/photo-1541824894660-f23ef4560ecb?auto=format&fit=crop&q=80&w=600'],
        material: 'Marble',
        dimensions: '60x60 cm'
      },
      {
        name: 'European Oak Flooring',
        sku: 'WOD-OAK-02',
        brand: 'FloorMaster',
        category: 'Furniture',
        price: 120,
        stock: 1000,
        description: 'Durable and elegant European Oak hardwood flooring.',
        images: ['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=600'],
        material: 'European Oak',
        dimensions: 'Variable Lengths'
      },
      {
        name: 'Modern Crystal Chandelier',
        sku: 'LGT-CHR-03',
        brand: 'CrystalBeam',
        category: 'Electricals',
        price: 890,
        stock: 25,
        description: 'Grand crystal chandelier for high-ceiling foyers and dining rooms.',
        images: ['https://images.unsplash.com/photo-1543157145-f78c636d023d?auto=format&fit=crop&q=80&w=600'],
        material: 'Crystal / Chrome',
        dimensions: '80cm Diameter'
      },
      {
        name: 'Designer Ceramic Pedestal Basin',
        sku: 'SAN-BAS-04',
        brand: 'PureWater',
        category: 'Sanitary',
        price: 350,
        stock: 40,
        description: 'Minimalist designer ceramic basin with a matt finish.',
        images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600'],
        material: 'Ceramic',
        dimensions: 'Standard'
      },
      {
        name: 'Emerald Velvet Armchair',
        sku: 'FUR-CHA-01',
        brand: 'LuxSit',
        category: 'Furniture',
        price: 650,
        stock: 15,
        description: 'Art Deco style emerald green velvet armchair with gold legs.',
        images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600'],
        material: 'Velvet / Steel',
        dimensions: 'Standard'
      }
    ];

    await Catalog.deleteMany({});
    await Catalog.insertMany(sampleCatalog);
    
    console.log('10 Catalog products seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding catalog:', error);
    process.exit(1);
  }
};

seedCatalog();
