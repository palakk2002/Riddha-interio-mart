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
    image: 'http://localhost:5000/uploads/categories/carrara_marble.png',
    subcategories: [{ name: 'Polished' }, { name: 'Honed' }]
  },
  {
    name: 'Vitrified Tiles',
    description: 'Durable, low-maintenance tiles with a mirror-like polished finish, ideal for high-traffic living areas.',
    image: 'http://localhost:5000/uploads/categories/vitrified_tiles.png',
    subcategories: [{ name: 'Double Charged' }, { name: 'Nano Polished' }]
  },
  {
    name: 'Granite Flooring',
    description: 'Extremely tough natural stone floors with shimmering speckles, perfect for kitchens and hallways.',
    image: 'http://localhost:5000/uploads/categories/granite_flooring.png',
    subcategories: [{ name: 'Black Galaxy' }, { name: 'Imperial Red' }]
  },
  {
    name: 'Travertine Tiles',
    description: 'Natural porous stone with warm earthy tones, bringing a rustic yet sophisticated feel to any space.',
    image: 'http://localhost:5000/uploads/categories/travertine_tiles.png',
    subcategories: [{ name: 'Silver Travertine' }, { name: 'Beige Honed' }]
  },
  {
    name: 'Porcelain Tiles',
    description: 'Highly dense and frost-resistant tiles, perfect for both indoor and outdoor heavy-duty applications.',
    image: 'http://localhost:5000/uploads/categories/porcelain_tiles.png',
    subcategories: [{ name: 'Matte Finish' }, { name: 'Rustic Series' }]
  },
  {
    name: 'Ceramic Wall Tiles',
    description: 'Lightweight and stylish tiles specifically designed for bathroom and kitchen walls.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80',
    subcategories: [{ name: 'Glossy Finish' }, { name: '3D Texture' }]
  },
  {
    name: 'Slate Stone',
    description: 'Natural split-face stone with a unique layered texture, ideal for feature walls and outdoor patios.',
    image: 'https://images.unsplash.com/photo-1596435602446-231920b33ec8?w=1200&q=80',
    subcategories: [{ name: 'Black Slate' }, { name: 'Multi-Color Slate' }]
  },
  {
    name: 'Mosaic & Highlighters',
    description: 'Intricate decorative tiles used to create stunning patterns and accent walls in modern interiors.',
    image: 'https://images.unsplash.com/photo-1620626011761-9963d7b59675?w=1200&q=80',
    subcategories: [{ name: 'Glass Mosaic' }, { name: 'Stone Highlighters' }]
  },
  {
    name: 'Wooden Plank Tiles',
    description: 'Tiles that replicate the natural beauty of hardwood floors without the maintenance headaches.',
    image: 'https://images.unsplash.com/photo-1581456495147-41fb90673962?w=1200&q=80',
    subcategories: [{ name: 'Oak Texture' }, { name: 'Walnut Finish' }]
  },
  {
    name: 'Terracotta Tiles',
    description: 'Traditional handmade clay tiles that offer a warm, earthy Mediterranean aesthetic.',
    image: 'https://images.unsplash.com/photo-1594911776735-9830560b4ef7?w=1200&q=80',
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
