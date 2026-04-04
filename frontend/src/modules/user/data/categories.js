import furnitureImg from '../../../assets/furniture.jpg';
import furniture2Img from '../../../assets/furniture2.jpg';
import lightingImg from '../../../assets/lighting.jpg';
import tapImg from '../../../assets/tap.jpg';

export const categories = [
  {
    id: 1,
    name: 'Luxury Tiles',
    slug: 'tiles',
    image: tapImg,
    productCount: 42,
    tabs: ['Luxury']
  },
  {
    id: 2,
    name: 'Designer Paints',
    slug: 'paints',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80',
    productCount: 28,
    tabs: ['Decor']
  },
  {
    id: 3,
    name: 'Modern Electricals',
    slug: 'electricals',
    image: lightingImg,
    productCount: 15,
    tabs: ['Luxury', 'Decor']
  },
  {
    id: 4,
    name: 'Premium Furniture',
    slug: 'furniture',
    image: furnitureImg,
    productCount: 36,
    tabs: ['Furniture', 'Living Room', 'Bed Room']
  },
  {
    id: 101,
    name: 'Home Decor',
    slug: 'decor',
    image: furniture2Img,
    productCount: 24,
    tabs: ['Decor', 'Living Room']
  },
  {
    id: 102,
    name: 'Kitchen',
    slug: 'kitchen',
    image: furnitureImg,
    productCount: 18,
    tabs: ['Decor']
  },
  {
    id: 103,
    name: 'Lamps',
    slug: 'lighting',
    image: lightingImg,
    productCount: 22,
    tabs: ['Luxury', 'Decor']
  },
  {
    id: 104,
    name: 'Furnishings',
    slug: 'furnishings',
    image: furniture2Img,
    productCount: 31,
    tabs: ['Furniture', 'Decor']
  },
  {
    id: 105,
    name: 'Bath',
    slug: 'bath',
    image: tapImg,
    productCount: 12,
    tabs: ['Luxury']
  },
  {
    id: 106,
    name: 'Curtains',
    slug: 'curtains',
    image: furnitureImg,
    productCount: 14,
    tabs: ['Decor', 'Living Room']
  },
  {
    id: 107,
    name: 'Luxury Beds',
    slug: 'beds',
    image: 'https://images.unsplash.com/photo-1505693419173-42b9258a6270?w=800&q=80',
    productCount: 14,
    tabs: ['Furniture', 'Bed Room']
  }
];
