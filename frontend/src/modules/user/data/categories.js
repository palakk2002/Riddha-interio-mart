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
    productCount: 42
  },
  {
    id: 2,
    name: 'Designer Paints',
    slug: 'paints',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80',
    productCount: 28
  },
  {
    id: 3,
    name: 'Modern Electricals',
    slug: 'electricals',
    image: lightingImg,
    productCount: 15
  },
  {
    id: 4,
    name: 'Premium Furniture',
    slug: 'furniture',
    image: furnitureImg,
    productCount: 36
  }
];
