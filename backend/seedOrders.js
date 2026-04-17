const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
const Order = require('./src/models/Order');
const User = require('./src/models/User');
const Seller = require('./src/models/Seller');

// Force use of Google DNS for SRV resolution
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load environment variables
dotenv.config();

const seedOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/riddha_mart', {});
    console.log('MongoDB connected');

    // Get first user and sellers from database
    const users = await User.find().limit(3);
    const sellers = await Seller.find().limit(3);

    if (users.length === 0 || sellers.length === 0) {
      console.log('Please create users and sellers first before seeding orders');
      process.exit(1);
    }

    // Sample orders data
    const orders = [
      {
        user: users[0]._id,
        seller: sellers[0]._id,
        orderItems: [
          {
            name: 'Carrara Marble Tiles',
            quantity: 2,
            image: 'http://localhost:5000/uploads/categories/carrara_marble.png',
            price: 5000,
            product: new mongoose.Types.ObjectId(),
            seller: sellers[0]._id
          }
        ],
        shippingAddress: {
          fullName: users[0].fullName || 'Customer',
          mobileNumber: '9999999999',
          pincode: '110001',
          city: 'Delhi',
          fullAddress: '123 Main Street',
          landmark: 'Near Park'
        },
        paymentMethod: 'Online',
        itemsPrice: 10000,
        shippingPrice: 500,
        totalPrice: 10500,
        isPaid: true,
        paidAt: new Date(),
        status: 'Pending'
      },
      {
        user: users[1]._id,
        seller: sellers[1]._id,
        orderItems: [
          {
            name: 'Vitrified Tiles',
            quantity: 5,
            image: 'http://localhost:5000/uploads/categories/vitrified_tiles.png',
            price: 2000,
            product: new mongoose.Types.ObjectId(),
            seller: sellers[1]._id
          }
        ],
        shippingAddress: {
          fullName: users[1].fullName || 'Customer 2',
          mobileNumber: '9888888888',
          pincode: '400001',
          city: 'Mumbai',
          fullAddress: '456 Oak Avenue',
          landmark: 'Near Station'
        },
        paymentMethod: 'Online',
        itemsPrice: 10000,
        shippingPrice: 600,
        totalPrice: 10600,
        isPaid: true,
        paidAt: new Date(),
        status: 'Processing',
        isDelivered: false
      },
      {
        user: users[2]._id,
        seller: sellers[2]._id,
        orderItems: [
          {
            name: 'Granite Flooring',
            quantity: 3,
            image: 'http://localhost:5000/uploads/categories/granite_flooring.png',
            price: 3000,
            product: new mongoose.Types.ObjectId(),
            seller: sellers[2]._id
          }
        ],
        shippingAddress: {
          fullName: users[2].fullName || 'Customer 3',
          mobileNumber: '9777777777',
          pincode: '560001',
          city: 'Bangalore',
          fullAddress: '789 Pine Road',
          landmark: 'Near Market'
        },
        paymentMethod: 'Online',
        itemsPrice: 9000,
        shippingPrice: 500,
        totalPrice: 9500,
        isPaid: true,
        paidAt: new Date(Date.now() - 86400000), // yesterday
        status: 'Shipped',
        isDelivered: false
      },
      {
        user: users[0]._id,
        seller: sellers[1]._id,
        orderItems: [
          {
            name: 'Porcelain Tiles',
            quantity: 4,
            image: 'http://localhost:5000/uploads/categories/porcelain_tiles.png',
            price: 2500,
            product: new mongoose.Types.ObjectId(),
            seller: sellers[1]._id
          }
        ],
        shippingAddress: {
          fullName: users[0].fullName || 'Customer',
          mobileNumber: '9999999999',
          pincode: '110001',
          city: 'Delhi',
          fullAddress: '123 Main Street',
          landmark: 'Near Park'
        },
        paymentMethod: 'Online',
        itemsPrice: 10000,
        shippingPrice: 500,
        totalPrice: 10500,
        isPaid: true,
        paidAt: new Date(Date.now() - 172800000), // 2 days ago
        status: 'Delivered',
        isDelivered: true,
        deliveredAt: new Date(Date.now() - 86400000)
      }
    ];

    // Clear existing orders
    await Order.deleteMany({});
    console.log('Old orders cleared');

    // Insert new orders
    const createdOrders = await Order.insertMany(orders);
    console.log(`${createdOrders.length} orders seeded successfully`);

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding orders:', error);
    process.exit(1);
  }
};

seedOrders();
