const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./src/models/Product');
const Brand = require('./src/models/Brand');

const SELLER_ID = '6a0ee8a7f3bb506e4d6c7501';

const categories = [
  { id: '6a0daa6c047bdee23fc76678', name: 'OutDoor', icon: 'LuUmbrella' },
  { id: '6a0daa76047bdee23fc766c7', name: 'Office', icon: 'LuBriefcase' },
  { id: '6a0daa84047bdee23fc76716', name: 'Bathroom', icon: 'LuBath' },
  { id: '6a0daab7047bdee23fc76767', name: 'Hardware', icon: 'LuHammer' },
  { id: '6a0daaed047bdee23fc767b7', name: 'ModularKitchen', icon: 'LuChefHat' }
];

const connectDB = require('./src/config/db');

connectDB()
  .then(async () => {
    try {
      // Find or create a generic brand for these products
      let brand = await Brand.findOne();
      if (!brand) {
        brand = await Brand.create({ name: 'Test Brand', image: 'test_brand.jpg', isActive: true });
        console.log('Created brand:', brand._id);
      }

      console.log(`Seeding products for Seller: ${SELLER_ID}`);
      let totalCreated = 0;

      for (const cat of categories) {
        // Create 2 dummy products for each category
        for (let i = 1; i <= 2; i++) {
          const productData = {
            name: `Test ${cat.name} Product ${i}`,
            sku: `TST-${cat.name.toUpperCase()}-00${i}`,
            description: `This is a test product for the ${cat.name} category to test the seller flow.`,
            price: 500 + (i * 100),
            sellerPrice: 400 + (i * 100),
            category: cat.name,
            brand: brand._id,
            countInStock: 20,
            seller: SELLER_ID,
            sellerType: 'Seller',
            approvalStatus: 'approved',
            isApproved: true,
            isActive: true,
            images: ['https://placehold.co/400x400.png?text=' + cat.name],
            weight: 2
          };

          const prod = new Product(productData);
          await prod.save();
          console.log(`Created product: ${prod.name} in Category: ${cat.name}`);
          totalCreated++;
        }
      }

      console.log(`Successfully created ${totalCreated} products across all categories.`);
    } catch (err) {
      console.error('Error during product seeding:', err);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('DB Connection Error:', err);
    process.exit(1);
  });
