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
    inStock: true,
    specifications: {
      "Brand": "Luxury Tiles",
      "Material": "Natural Marble",
      "Finish": "Polished",
      "Size": "24x24 inches",
      "Thickness": "10mm",
      "Edge": "Rectified",
      "Origin": "Italy"
    }
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
    inStock: true,
    specifications: {
      "Brand": "Laxmi Paints",
      "Type": "Interior Emulsion",
      "Finish": "Pure Matte",
      "Coverage": "120-140 sq.ft/L",
      "Drying Time": "30-60 mins",
      "VOC Level": "Low VOC",
      "Washability": "High"
    }
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
    inStock: true,
    specifications: {
      "Brand": "Sturlite",
      "Power": "12W",
      "Voltage": "220-240V",
      "Life Hours": "30,000",
      "Color Temp": "3000K (Warm White)",
      "CRI": ">85",
      "Socket Type": "E27"
    }
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
    inStock: true,
    specifications: {
      "Brand": "Artisan Wood",
      "Material": "Solid Oak",
      "Style": "Contemporary",
      "Assembly": "Pre-assembled",
      "Care": "Wipe with dry cloth",
      "Weight": "15 kg",
      "Dimensions": "40x40x18 inches"
    }
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
    inStock: true,
    specifications: {
      "Brand": "Sturlite",
      "Power": "7W",
      "Voltage": "220V",
      "Life Hours": "25,000",
      "Color Temp": "4000K (Natural White)",
      "CRI": ">90",
      "Socket Type": "B22"
    }
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
    inStock: true,
    specifications: {
      "Brand": "Luxury Comfort",
      "Material": "Velvet & Steel",
      "Leg Finish": "Gold Plated",
      "Assembly": "Tool-free",
      "Max Weight": "120 kg",
      "Care": "Professional Clean"
    }
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
    inStock: true,
    specifications: {
      "Brand": "Terra Tiles",
      "Material": "Porcelain",
      "Look": "Natural Oak",
      "Finish": "Matt",
      "Waterproof": "Yes",
      "Edge": "Micro-bevel"
    }
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
    inStock: true,
    specifications: {
      "Brand": "Laxmi Paints",
      "Type": "Luxury Satin",
      "Finish": "Soft Sheen",
      "Coverage": "140-160 sq.ft/L",
      "VOC Level": "Non-Toxic",
      "Scuff Resistance": "High"
    }
  },
  {
    id: 9,
    name: "Industrial Wall Sconce",
    category: "electricals",
    price: 45,
    originalPrice: 65,
    image: lightingImg,
    rating: 4.5,
    colors: ["#2D3436", "#636E72"],
    sizes: ["Standard"],
    description: "Vintage-inspired wall sconce with a matte black finish, perfect for hallways.",
    features: ["Steel construction", "Easy installation", "E26 socket"],
    inStock: true,
    specifications: {
      "Brand": "Sturlite",
      "Material": "Carbon Steel",
      "Finish": "Matte Black",
      "Voltage": "110-240V",
      "Style": "Industrial",
      "Bulb Included": "No"
    }
  },
  {
    id: 10,
    name: "Royal Velvet Cushion",
    category: "furniture",
    price: 25,
    originalPrice: 35,
    image: furniture2Img,
    rating: 4.9,
    colors: ["#922724", "#2D3436", "#544339"],
    sizes: ["16x16", "18x18"],
    description: "Ultra-soft velvet cushion with a hidden zipper and premium poly-fill.",
    features: ["Machine washable", "Hypoallergenic", "Rich texture"],
    inStock: true,
    specifications: {
      "Brand": "Luxury Comfort",
      "Fabric": "Micro-Velvet",
      "Fill": "3D Conjugated Fiber",
      "Zipper": "YKK Hidden",
      "Origin": "India"
    }
  },
  {
    id: 11,
    name: "Modern Kitchen Faucet",
    category: "tiles",
    price: 180,
    originalPrice: 220,
    image: tapImg,
    rating: 4.7,
    colors: ["#DFE6E9", "#B2BEC3"],
    sizes: ["Standard"],
    description: "High-arch swivel faucet with a pull-down sprayer and chrome finish.",
    features: ["Lead-free", "Ceramic valve", "Dual mode spray"],
    inStock: true,
    specifications: {
      "Brand": "Aqua Premium",
      "Material": "Solid Brass",
      "Finish": "Chrome",
      "Flow Rate": "1.8 GPM",
      "Mounting": "Single Hole"
    }
  },
  {
    id: 12,
    name: "Soft Cloud Mattress",
    category: "furniture",
    price: 450,
    originalPrice: 550,
    image: "https://images.unsplash.com/photo-1505693419173-42b9258a6270?w=800&q=80",
    rating: 4.8,
    colors: ["#FFFFFF"],
    sizes: ["Queen", "King"],
    description: "Multi-layered memory foam mattress designed for spinal alignment.",
    features: ["Cooling gel", "Motion isolation", "Breathable cover"],
    inStock: true,
    specifications: {
      "Brand": "SleepWell",
      "Type": "Memory Foam",
      "Firmness": "Medium-Firm",
      "Height": "10 inches",
      "Warranty": "10 Years"
    }
  },
  {
    id: 13,
    name: "Architectural Spotlight",
    category: "electricals",
    price: 35,
    originalPrice: 45,
    image: lightingImg,
    rating: 4.6,
    colors: ["#FFFFFF", "#2D3436"],
    sizes: ["7W", "12W"],
    description: "Directional ceiling spotlight with a focused beam for art and task lighting.",
    features: ["360° rotation", "Narrow beam", "Aluminium heat sink"],
    inStock: true,
    specifications: {
      "Brand": "Sturlite",
      "Type": "COB Track Light",
      "Color Temp": "5000K (Cool White)",
      "Beam Angle": "24°",
      "Material": "Die-cast Aluminium"
    }
  },
  {
    id: 14,
    name: "Sky Blue Texture Paint",
    category: "paints",
    price: 60,
    originalPrice: 75,
    image: "https://images.unsplash.com/photo-1541443131876-44b03de101c5?w=800&q=80",
    rating: 4.5,
    colors: ["#74B9FF", "#81ECEC"],
    sizes: ["5L", "10L"],
    description: "Textured wall finish that creates a serene, sky-like atmosphere in your home.",
    features: ["Anti-fungal", "Stain resistant", "High durability"],
    inStock: true,
    specifications: {
      "Brand": "Laxmi Paints",
      "Finish": "Aggregate Texture",
      "Base": "Water-based",
      "Coverage": "40-60 sq.ft/L",
      "Drying Time": "4 hours"
    }
  }
];
