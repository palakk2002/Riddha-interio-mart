const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const http = require('http');

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
const errorHandler = require('./middleware/errorMiddleware');
const { initSocket } = require('./socket');

const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Enable CORS
app.use(cors());

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
app.use('/api/auth/seller', sellerRoutes);
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

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Riddha Mart API' });
});

app.use(errorHandler);

// Port configuration
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

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
