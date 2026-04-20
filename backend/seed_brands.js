const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Brand = require('./src/models/Brand');
const connectDB = require('./src/config/db');

dotenv.config();

const brands = [
  {
    name: 'Kohler',
    logo: 'https://logos-world.net/wp-content/uploads/2021/08/Kohler-Logo.png',
    offer: 'Luxury Bath Fittings - Up to 20% Off',
    isActive: true,
    banners: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'],
    categories: [
      { name: 'Bathroom', slug: 'bath', image: 'https://images.unsplash.com/photo-1620626011761-9963d7521476?w=800&q=80' }
    ]
  },
  {
    name: 'Asian Paints',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Asian_Paints_logo.svg/2560px-Asian_Paints_logo.svg.png',
    offer: 'Texture & Designer Wall Finishes',
    isActive: true,
    banners: ['https://images.unsplash.com/photo-1562624382-82b89b002845?w=1200&q=80'],
    categories: [
      { name: 'Paints', slug: 'paints', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80' }
    ]
  },
  {
    name: 'Jaquar',
    logo: 'https://logoverse.com/wp-content/uploads/2023/12/Jaquar-Logo-PNG.png',
    offer: 'Complete Bathroom Solutions',
    isActive: true,
    banners: ['https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&q=80'],
    categories: [
      { name: 'Sanitaryware', slug: 'bath', image: 'https://images.unsplash.com/photo-1507652313519-d4c9174996dd?w=800&q=80' }
    ]
  },
  {
    name: 'Heffele',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/H%C3%A4fele_Logo.svg/2560px-H%C3%A4fele_Logo.svg.png',
    offer: 'German Engineered Fittings',
    isActive: true,
    banners: ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80'],
    categories: [
      { name: 'Kitchen Hardware', slug: 'kitchen', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80' }
    ]
  },
  {
    name: 'IKEA',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Ikea_logo.svg/2560px-Ikea_logo.svg.png',
    offer: 'Modern Affordable Design',
    isActive: true,
    banners: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80'],
    categories: [
      { name: 'Furniture', slug: 'furniture', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80' }
    ]
  },
  {
    name: 'Yale',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Yale_logo.svg/2560px-Yale_logo.svg.png',
    offer: 'The World\'s Favorite Lock',
    isActive: true,
    banners: ['https://images.unsplash.com/photo-1558002038-1055907df827?w=1200&q=80'],
    categories: [
      { name: 'Smart Locks', slug: 'electricals', image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80' }
    ]
  },
  {
    name: 'Philips',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Philips_logo.svg/2560px-Philips_logo.svg.png',
    offer: 'Innovation and You',
    isActive: true,
    banners: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200&q=80'],
    categories: [
      { name: 'Lighting', slug: 'lighting', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80' }
    ]
  },
  {
    name: 'Stanley',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Stanley_logo.svg/2560px-Stanley_logo.svg.png',
    offer: 'Tools for Professionals',
    isActive: true,
    banners: ['https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=1200&q=80'],
    categories: [
      { name: 'Power Tools', slug: 'electricals', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80' }
    ]
  },
  {
    name: 'Saint-Gobain',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Saint-Gobain_logo.svg/2560px-Saint-Gobain_logo.svg.png',
    offer: 'High-Performance Glass',
    isActive: true,
    banners: ['https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80'],
    categories: [
      { name: 'Interior Glass', slug: 'tiles', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80' }
    ]
  },
  {
    name: 'Godrej',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/Godrej_Logo.svg/1200px-Godrej_Logo.svg.png',
    offer: 'Built to Last',
    isActive: true,
    banners: ['https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=1200&q=80'],
    categories: [
      { name: 'Furniture', slug: 'furniture', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80' }
    ]
  }
];

const seedBrands = async () => {
  try {
    await connectDB();
    console.log('Clearing existing brands...');
    await Brand.deleteMany({});
    
    console.log('Seeding 10 premium brands...');
    for (const b of brands) {
       await Brand.create(b);
       console.log(`Added: ${b.name}`);
    }

    console.log('Successfully seeded brands!');
    process.exit();
  } catch (err) {
    console.error('Error seeding brands:', err);
    process.exit(1);
  }
};

seedBrands();
