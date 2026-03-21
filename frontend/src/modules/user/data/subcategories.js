import furnitureImg from '../../../assets/furniture.jpg';
import furniture2Img from '../../../assets/furniture2.jpg';
import lightingImg from '../../../assets/lighting.jpg';
import tapImg from '../../../assets/tap.jpg';

export const subcategories = {
  furniture: [
    { id: 1, name: 'Sofas', slug: 'sofas', image: furnitureImg },
    { id: 2, name: 'Beds', slug: 'beds', image: furniture2Img },
    { id: 3, name: 'Dining Sets', slug: 'dining-sets', image: furnitureImg },
    { id: 4, name: 'Study Tables', slug: 'study-tables', image: furniture2Img },
    { id: 5, name: 'Centre Tables', slug: 'centre-tables', image: furnitureImg },
    { id: 6, name: 'Recliners', slug: 'recliners', image: furniture2Img },
    { id: 7, name: 'Sectional Sofas', slug: 'sectional-sofas', image: furnitureImg },
    { id: 8, name: 'Wardrobes', slug: 'wardrobes', image: furniture2Img },
    { id: 9, name: 'Cabinets & Sideboards', slug: 'cabinets', image: furnitureImg },
    { id: 10, name: 'Office Tables', slug: 'office-tables', image: furniture2Img },
    { id: 11, name: 'Shoe Racks', slug: 'shoe-racks', image: furnitureImg },
    { id: 12, name: 'Kitchen Cabinets', slug: 'kitchen-cabinets', image: furniture2Img },
  ],
  tiles: [
    { id: 201, name: 'Floor Tiles', slug: 'floor-tiles', image: tapImg },
    { id: 202, name: 'Wall Tiles', slug: 'wall-tiles', image: tapImg },
  ],
  paints: [
    { id: 301, name: 'Interior Paints', slug: 'interior-paints', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80' },
    { id: 302, name: 'Exterior Paints', slug: 'exterior-paints', image: 'https://images.unsplash.com/photo-1562663474-6cbb3fee4c77?w=600&q=80' },
  ]
};
