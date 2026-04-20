const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const Catalog = require('./src/models/Catalog');
const connectDB = require('./src/config/db');

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const products = [
  {
    name: 'Carrara Marble Premium Slab',
    sku: 'CAT-MRB-001',
    brand: 'Italian Heritage',
    category: 'Stones',
    price: 4500,
    stock: 50,
    description: 'Authentic Italian Carrara marble with deep grey veining and polished finish. Ideal for luxury flooring and countertops.',
    images: ['https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=800&q=80'],
    material: 'Natural Marble',
    dimensions: '24x24 inches'
  },
  {
    name: 'Vitrified Charcoal Tiles',
    sku: 'CAT-TIL-002',
    brand: 'Modern Surface',
    category: 'Tiles',
    price: 1200,
    stock: 200,
    description: 'High-density vitrified floor tiles with a matte charcoal finish. Water-resistant and highly durable for high-traffic areas.',
    images: ['https://images.unsplash.com/photo-1589307730386-b4ca4e3a84e6?w=800&q=80'],
    material: 'Ceramic',
    dimensions: '600x600 mm'
  },
  {
    name: 'Teak Wood Platform Bed',
    sku: 'CAT-FUR-003',
    brand: 'Riddha Crafts',
    category: 'Furniture',
    price: 48000,
    stock: 10,
    description: 'Solid teak wood platform bed with a minimalist design and natural oil finish. Includes hidden storage drawers.',
    images: ['https://images.unsplash.com/photo-1505693419173-42b9258a6270?w=800&q=80'],
    material: 'Solid Teak Wood',
    dimensions: 'King Size'
  },
  {
    name: 'Granite Countertop Emerald',
    sku: 'CAT-KIT-004',
    brand: 'Stone Craft',
    category: 'Stones',
    price: 8500,
    stock: 30,
    description: 'Exotic emerald green granite slab. Heat and scratch resistant, perfect for modern kitchen islands.',
    images: ['https://images.unsplash.com/photo-1565183928294-7063f23ce0f7?w=800&q=80'],
    material: 'Natural Granite',
    dimensions: '8x2.5 feet'
  },
  {
    name: 'Swan Neck Golden Faucet',
    sku: 'CAT-BAT-005',
    brand: 'Royal Bath',
    category: 'Bath',
    price: 12500,
    stock: 45,
    description: 'Elegant swan-neck bathroom faucet with a brushed gold finish. Features ceramic disc valves for drip-free performance.',
    images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80'],
    material: 'Brass',
    dimensions: 'Standard Mount'
  },
  {
    name: 'Smart Recessed LED Panel',
    sku: 'CAT-LGT-006',
    brand: 'Luminaire',
    category: 'Lighting',
    price: 2200,
    stock: 500,
    description: 'Ultra-slim 12W LED panel with smart intensity and color temperature control via mobile app.',
    images: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80'],
    material: 'Aluminium/Polycarbonate',
    dimensions: '6 inch Circular'
  },
  {
    name: 'Hand-Tufted Woolen Rug',
    sku: 'CAT-DEC-007',
    brand: 'Artisan Weaves',
    category: 'Home Decor',
    price: 15500,
    stock: 25,
    description: 'Traditional Persian pattern hand-tufted in premium New Zealand wool. Soft texture and high-density pile.',
    images: ['https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&q=80'],
    material: 'New Zealand Wool',
    dimensions: '5x8 feet'
  },
  {
    name: 'Oak Finish Office Desk',
    sku: 'CAT-OFF-008',
    brand: 'Space Optimal',
    category: 'Furniture',
    price: 22000,
    stock: 15,
    description: 'L-shaped home office desk with white oak finish. Features built-in cable management and ergonomic height.',
    images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80'],
    material: 'Engineered Wood/Metal',
    dimensions: '60x30 inches'
  },
  {
    name: 'Ceramic Wall Panel Bloom',
    sku: 'CAT-WLL-009',
    brand: 'Decor Tiles',
    category: 'Tiles',
    price: 850,
    stock: 1000,
    description: 'Artistic 3D ceramic wall panels with floral relief patterns. Perfect for feature walls in living rooms.',
    images: ['https://images.unsplash.com/photo-1581850518616-bcb8186c39ed?w=800&q=80'],
    material: 'Ceramic',
    dimensions: '300x450 mm'
  },
  {
    name: 'Ergonomic Task Chair',
    sku: 'CAT-FUR-010',
    brand: 'Space Optimal',
    category: 'Furniture',
    price: 18000,
    stock: 40,
    description: 'Mesh-back ergonomic office chair with lumbar support and adjustable 4D armrests. Breathable and comfortable.',
    images: ['https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80'],
    material: 'Nylon Mesh/Aluminium',
    dimensions: 'Adjustable Height'
  }
];

const seedCatalog = async () => {
  try {
    await connectDB();
    
    // Clear existing catalog if needed, or just insert new ones
    // await Catalog.deleteMany({});
    
    console.log('Seeding 10 catalog products...');
    
    // Since images are already URLs, we can just insert them.
    // In a real scenario, we might upload local files to Cloudinary here.
    
    for (const prod of products) {
      // Check if SKU already exists to avoid errors
      const exists = await Catalog.findOne({ sku: prod.sku });
      if (!exists) {
        await Catalog.create(prod);
        console.log(`Added: ${prod.name}`);
      } else {
        console.log(`Skipped (exists): ${prod.name}`);
      }
    }

    console.log('Successfully seeded catalog!');
    process.exit();
  } catch (err) {
    console.error('Error seeding catalog:', err);
    process.exit(1);
  }
};

seedCatalog();
