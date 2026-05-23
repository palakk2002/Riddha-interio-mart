const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const helmet = require('helmet');
const { limiter, authLimiter } = require('./middleware/rateLimiter');

const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Route files
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const addressRoutes = require('./routes/addressRoutes');
const orderRoutes = require('./routes/orderRoutes');
const homeBannerRoutes = require('./routes/homeBannerRoutes');
const promoBannerRoutes = require('./routes/promoBannerRoutes');
const sectionRoutes = require('./routes/sectionRoutes');
const favouriteSectionRoutes = require('./routes/favouriteSectionRoutes');
const brandRoutes = require('./routes/brandRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const bulkOrderRoutes = require('./routes/bulkOrderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const returnRoutes = require('./routes/returnRoutes');
const referralRoutes = require('./routes/referralRoutes');
const taxRoutes = require('./routes/taxRoutes');
const walletRoutes = require('./routes/walletRoutes');
const marketingRoutes = require('./routes/marketingRoutes');
const supportRoutes = require('./routes/supportRoutes');
const dispatchRoutes = require('./routes/dispatchRoutes');
const b2bLeadRoutes = require('./routes/b2bLeadRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const { initSocket } = require('./socket');

const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Enable CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  credentials: true
}));

// Set security HTTP headers
app.use(helmet());

// Apply rate limiting to all routes
app.use('/api', limiter);

// Apply stricter rate limiting to auth routes
app.use('/api/auth', authLimiter);

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Set static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Mount routes
app.use('/api/products', productRoutes);
app.use('/api/auth/user', userRoutes);
app.use('/api/auth/admin', adminRoutes);

// Test route
const { protect } = require('./middleware/auth');
const { getSellerCustomers } = require('./controllers/sellerController');
app.get('/api/auth/seller/customers', protect, getSellerCustomers);
app.get('/api/seller/customers', protect, getSellerCustomers);

app.use('/api/auth/seller', sellerRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth/delivery', deliveryRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/home-banner', homeBannerRoutes);
app.use('/api/promo-banner', promoBannerRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/favourite-section', favouriteSectionRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/bulk-orders', bulkOrderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/returns', returnRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/tax', taxRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/dispatch', dispatchRoutes);
app.use('/api/b2b-leads', b2bLeadRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Riddha Mart API' });
});

app.get('/api/config/razorpay', (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
});


app.get('/api/add-dummy-products', async (req, res) => {
  try {
    const Seller = require('./models/Seller');
    const Product = require('./models/Product');
    const Brand = require('./models/Brand');
    
    const seller = await Seller.findOne({ email: 'sheetal12@gmail.com' });
    if (!seller) return res.status(404).json({ error: 'Seller not found' });
    
    let brand = await Brand.findOne();
    if (!brand) {
      brand = await Brand.create({ name: 'Sheetal Brand', image: 'dummy.jpg', isActive: true });
    }
    
    for (let i = 1; i <= 5; i++) {
      await Product.create({
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
    }
    res.json({ success: true, message: 'Added 5 products' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/add-dummy-delivery', async (req, res) => {
  try {
    const Delivery = require('./models/Delivery');
    const dummyDeliveries = [
      {
        fullName: 'Ramesh Kumar',
        email: 'ramesh.delivery@example.com',
        phone: '9876543210',
        vehicleType: 'Bike',
        vehicleNumber: 'MH01AB1234',
        password: 'password123',
        status: 'Available',
        approvalStatus: 'Approved',
        servicePincodes: ['400001', '400002']
      },
      {
        fullName: 'Suresh Singh',
        email: 'suresh.delivery@example.com',
        phone: '9876543211',
        vehicleType: 'Van',
        vehicleNumber: 'MH02CD5678',
        password: 'password123',
        status: 'Available',
        approvalStatus: 'Approved',
        servicePincodes: ['400003', '400004']
      },
      {
        fullName: 'Amit Patel',
        email: 'amit.delivery@example.com',
        phone: '9876543212',
        vehicleType: 'Truck',
        vehicleNumber: 'GJ01EF9012',
        password: 'password123',
        status: 'Available',
        approvalStatus: 'Approved',
        servicePincodes: ['380001', '380002']
      }
    ];

    for (const d of dummyDeliveries) {
      const exists = await Delivery.findOne({ email: d.email });
      if (!exists) {
        await Delivery.create(d);
      }
    }
    res.json({ success: true, message: 'Added dummy delivery partners' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use(errorHandler);

// Port configuration
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // AUTO-ALIGNMENT AND DB DUMP
    try {
      const fs = require('fs');
      const path = require('path');
      const Product = require('./models/Product');
      const Brand = require('./models/Brand');
      const Category = require('./models/Category');

      // 1. Dump current products to inspect
      const allProducts = await Product.find({}, 'name category subcategory subsubcategory');
      fs.writeFileSync(path.join(__dirname, '../db_dump.json'), JSON.stringify(allProducts, null, 2));
      console.log("DB Dump written to db_dump.json");

      // 2. Ensure we have a default brand
      let brand = await Brand.findOne();
      if (!brand) {
        brand = await Brand.create({ name: 'StoneAge' });
      }

      // 3. Create or update products to align with specific subcategories
      const productsToSeed = [
        {
          name: 'Traditional Terracotta Tile',
          description: 'Earthy, rustic traditional terracotta clay tile perfect for indoor/outdoor patios.',
          price: 120,
          category: 'Flooring',
          subcategory: 'Terracotta Tiles',
          brand: brand._id,
          sku: 'FLO-TER-001',
          hsnCode: '6802',
          countInStock: 250,
          images: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80'],
          seller: brand._id,
          sellerType: 'Admin',
          isApproved: true,
          approvalStatus: 'approved',
          isActive: true
        },
        {
          name: 'Polished Vitrified Tile',
          description: 'Premium ultra-glossy vitrified flooring tiles with marble veins.',
          price: 180,
          category: 'Flooring',
          subcategory: 'Vitrified Tiles',
          brand: brand._id,
          sku: 'FLO-VIT-001',
          hsnCode: '6802',
          countInStock: 400,
          images: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80'],
          seller: brand._id,
          sellerType: 'Admin',
          isApproved: true,
          approvalStatus: 'approved',
          isActive: true
        },
        {
          name: 'Carrara Marble Slab',
          description: 'Exquisite polished Carrara white marble slab imported directly from Italian quarries.',
          price: 320,
          category: 'Flooring',
          subcategory: 'Carrara Marble',
          brand: brand._id,
          sku: 'FLO-CAR-001',
          hsnCode: '6802',
          countInStock: 80,
          images: ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80'],
          seller: brand._id,
          sellerType: 'Admin',
          isApproved: true,
          approvalStatus: 'approved',
          isActive: true
        }
      ];

      for (const p of productsToSeed) {
        const exists = await Product.findOne({ name: p.name });
        if (!exists) {
          await Product.create(p);
          console.log(`Seeded alignment product: "${p.name}"`);
        } else {
          // Keep category/subcategory updated if it exists
          exists.category = p.category;
          exists.subcategory = p.subcategory;
          await exists.save();
        }
      }

      // 4. Update any existing products whose names match the subcategories
      await Product.updateMany({ name: /Terracotta/i }, { $set: { category: 'Flooring', subcategory: 'Terracotta Tiles' } });
      await Product.updateMany({ name: /Vitrified/i }, { $set: { category: 'Flooring', subcategory: 'Vitrified Tiles' } });
      await Product.updateMany({ name: /Carrara/i }, { $set: { category: 'Flooring', subcategory: 'Carrara Marble' } });

      // Dump again after alignment
      const allProductsUpdated = await Product.find({}, 'name category subcategory subsubcategory');
      fs.writeFileSync(path.join(__dirname, '../db_dump.json'), JSON.stringify(allProductsUpdated, null, 2));

    } catch (dbErr) {
      console.error("Database Alignment Startup Error:", dbErr);
    }

    // Start background email queue processor daemon
    const emailService = require('./services/emailService');
    emailService.startDaemon();

    // Start background stock reservation queue daemon
    const inventoryService = require('./services/inventoryService');
    inventoryService.startReservationDaemon();

    const server = http.createServer(app);
    initSocket(server);
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop other backend instances and restart.`);
      } else {
        console.error(`Server startup error: ${error.message}`);
      }
      process.exit(1);
    });

    server.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // server.close(() => process.exit(1));
});

module.exports = app;
