const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Seller = require('./src/models/Seller');
const Product = require('./src/models/Product');
const Brand = require('./src/models/Brand');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to DB');
    try {
      const seller = await Seller.findOne({ email: 'sheetal12@gmail.com' });
      if (!seller) {
        console.log('Seller not found');
        process.exit(1);
      }
      console.log('Found seller:', seller._id);

      let brand = await Brand.findOne();
      if (!brand) {
        brand = await Brand.create({ name: 'Sheetal Brand', image: 'dummy.jpg', isActive: true });
        console.log('Created brand:', brand._id);
      }

      for (let i = 1; i <= 5; i++) {
        const prod = new Product({
          name: `Sheetal Product ${i}`,
          description: `details sheetal for product ${i}`,
          price: 100 + i * 10,
          category: 'Furniture',
          brand: brand._id,
          countInStock: 50,
          seller: seller._id,
          sellerType: 'Seller',
          approvalStatus: 'approved',
          isApproved: true,
          images: ['https://via.placeholder.com/150']
        });
        await prod.save();
        console.log(`Created product ${i}`);
      }
      console.log('Successfully added 5 products');
    } catch (err) {
      console.error(err);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
