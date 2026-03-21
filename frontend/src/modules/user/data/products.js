import furnitureImg from '../../../assets/furniture.jpg';
import furniture2Img from '../../../assets/furniture2.jpg';
import lightingImg from '../../../assets/lighting.jpg';
import tapImg from '../../../assets/tap.jpg';

export const products = [
  {
    id: 1,
    name: "Classic Marble Tile",
    category: "tiles",
    price: 120,
    originalPrice: 150,
    image: tapImg,
    rating: 4.8,
    colors: ["#FFFFFF", "#F5F5F5", "#E0E0E0"],
    sizes: ["12x12", "24x24"],
    description: "Premium Italian marble tile with a polished finish, perfect for luxury living rooms.",
    features: ["Natural stone", "High durability", "Slightly reflective"],
    inStock: true
  },
  {
    id: 2,
    name: "Dusty Rose Matte Paint",
    category: "paints",
    price: 45,
    originalPrice: 55,
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80",
    rating: 4.5,
    colors: ["#8A6C5F", "#BFA38A", "#E0D9CF"],
    sizes: ["1L", "5L", "10L"],
    description: "Eco-friendly matte finish paint with superior coverage and a velvet feel.",
    features: ["Washable", "Low VOC", "Quick drying"],
    inStock: true
  },
  {
    id: 3,
    name: "Minimalist Pendant Light",
    category: "electricals",
    price: 89,
    originalPrice: 110,
    image: lightingImg,
    rating: 4.9,
    colors: ["#000000", "#FFFFFF", "#F5E9D3"],
    sizes: ["Small", "Medium"],
    description: "Sleek and modern pendant light that adds a warm glow to any dining area.",
    features: ["LED compatible", "Adjustable height", "Premium metal finish"],
    inStock: true
  },
  {
    id: 4,
    name: "Oak Wood Coffee Table",
    category: "furniture",
    price: 350,
    originalPrice: 420,
    image: furnitureImg,
    rating: 4.7,
    colors: ["#544339", "#8A6C5F"],
    sizes: ["Standard"],
    description: "Handcrafted coffee table made from solid oak wood with a natural finish.",
    features: ["Solid wood", "Minimalist design", "Eco-friendly varnish"],
    inStock: true
  },
  {
    id: 5,
    name: "Geometric Accent Lamp",
    category: "electricals",
    price: 65,
    originalPrice: 75,
    image: lightingImg,
    rating: 4.6,
    colors: ["#F5E9D3", "#8A6C5F"],
    sizes: ["One Size"],
    description: "A statement piece lamp that brings artistic lighting to your bedside table.",
    features: ["Soft lighting", "Modern aesthetic", "Compact size"],
    inStock: true
  },
  {
    id: 6,
    name: "Velvet Accent Chair",
    category: "furniture",
    price: 280,
    originalPrice: 320,
    image: furniture2Img,
    rating: 4.8,
    colors: ["#8A6C5F", "#544339", "#BFA38A"],
    sizes: ["Standard"],
    description: "Plush velvet chair with golden legs, blending comfort and high-end style.",
    features: ["Ergonomic back", "Golden metal legs", "Soft velvet fabric"],
    inStock: true
  },
  {
    id: 7,
    name: "Herringbone Wood Tile",
    category: "tiles",
    price: 85,
    originalPrice: 95,
    image: tapImg,
    rating: 4.7,
    colors: ["#BFA38A", "#8A6C5F"],
    sizes: ["12x24"],
    description: "Beautiful herringbone patterned wood-look tiles for a warm, natural aesthetic.",
    features: ["Waterproof", "Easy maintenance", "Natural texture"],
    inStock: true
  },
  {
    id: 8,
    name: "Deep Espresso Satin Paint",
    category: "paints",
    price: 50,
    originalPrice: 60,
    image: "https://images.unsplash.com/photo-1562624232-750d402b4fcb?w=800&q=80",
    rating: 4.6,
    colors: ["#544339"],
    sizes: ["1L", "5L"],
    description: "Rich espresso satin finish paint that creates a dramatic, luxury feel.",
    features: ["High pigment", "Scuff resistant", "Elegant sheen"],
    inStock: true
  }
];
