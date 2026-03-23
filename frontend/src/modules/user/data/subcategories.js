import furnitureImg from '../../../assets/furniture.jpg';
import furniture2Img from '../../../assets/furniture2.jpg';
import lightingImg from '../../../assets/lighting.jpg';
import tapImg from '../../../assets/tap.jpg';
import mattressImg from '../../../assets/mattress_premium.png';
import wallDecorImg from '../../../assets/wall_decor_premium.png';
import vasesImg from '../../../assets/vases_premium.png';
import mirrorsImg from '../../../assets/mirrors_premium.png';

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
    { id: 203, name: 'Exterior Tiles', slug: 'exterior-tiles', image: tapImg },
    { id: 204, name: 'Kitchen Tiles', slug: 'kitchen-tiles', image: tapImg },
  ],
  paints: [
    { id: 301, name: 'Interior Paints', slug: 'interior-paints', image: furniture2Img },
    { id: 302, name: 'Exterior Paints', slug: 'exterior-paints', image: furnitureImg },
    { id: 303, name: 'Wood Finishes', slug: 'wood-finishes', image: furniture2Img },
  ],
  electricals: [
    { id: 401, name: 'Designer Lights', slug: 'lights', image: lightingImg },
    { id: 402, name: 'Smart Fans', slug: 'fans', image: furniture2Img },
    { id: 403, name: 'Modular Switches', slug: 'switches', image: tapImg },
    { id: 404, name: 'Decorative Chandeliers', slug: 'chandeliers', image: lightingImg },
    { id: 405, name: 'Smart Home Automation', slug: 'smart-home', image: lightingImg },
    { id: 406, name: 'Concealed Lights', slug: 'concealed-lights', image: lightingImg },
  ],
  // Mattresses
  'ortho-mattress': [
    { id: 501, name: 'Firm Support', slug: 'firm', image: mattressImg },
    { id: 502, name: 'Extra Comfort', slug: 'comfort', image: mattressImg },
  ],
  'memory-foam': [
    { id: 511, name: 'Pillow Top', slug: 'pillow-top', image: mattressImg },
    { id: 512, name: 'Cooling Gel', slug: 'cooling-gel', image: mattressImg },
  ],
  'spring-mattress': [
    { id: 521, name: 'Individually Wrapped', slug: 'wrapped', image: mattressImg },
    { id: 522, name: 'Euro Top', slug: 'euro-top', image: mattressImg },
  ],
  'dual-comfort': [
    { id: 531, name: 'Reversible', slug: 'reversible', image: mattressImg },
    { id: 532, name: 'Hard & Soft', slug: 'hard-soft', image: mattressImg },
  ],
  'latex-mattress': [
    { id: 541, name: 'Natural Latex', slug: 'natural', image: mattressImg },
    { id: 542, name: 'Eco-Friendly', slug: 'eco', image: mattressImg },
  ],
  'hybrid-mattress': [
    { id: 551, name: 'Spring + Foam', slug: 'spring-foam', image: mattressImg },
    { id: 552, name: 'Ultimate Series', slug: 'ultimate', image: mattressImg },
  ],
  // Home Goods
  'wall-decor': [
    { id: 601, name: 'Canvas Paintings', slug: 'paintings', image: wallDecorImg },
    { id: 602, name: 'Metal Art', slug: 'metal-art', image: wallDecorImg },
    { id: 603, name: 'Wall Shelves', slug: 'shelves', image: wallDecorImg },
  ],
  'vases': [
    { id: 611, name: 'Ceramic Vases', slug: 'ceramic', image: vasesImg },
    { id: 612, name: 'Glass Art', slug: 'glass', image: vasesImg },
  ],
  'carpets': [
    { id: 621, name: 'Hand-woven', slug: 'woven', image: furnitureImg },
    { id: 622, name: 'Modern Abstract', slug: 'abstract', image: furnitureImg },
  ],
  'cushions': [
    { id: 631, name: 'Velvet Soft', slug: 'velvet', image: furniture2Img },
    { id: 632, name: 'Printed Collection', slug: 'printed', image: furniture2Img },
  ],
  'clocks': [
    { id: 641, name: 'Minimalist Wall', slug: 'min-wall', image: lightingImg },
    { id: 642, name: 'Vintage Series', slug: 'vintage', image: lightingImg },
  ],
  'mirrors': [
    { id: 651, name: 'Full Length', slug: 'full-length', image: mirrorsImg },
    { id: 652, name: 'Round Decor', slug: 'round', image: mirrorsImg },
  ]
};
