const mongoose = require('mongoose');
const Delivery = require('./src/models/Delivery');
require('dotenv').config();

const partners = [
  { 
    fullName: "Rajesh Kumar", 
    email: "rajesh@example.com", 
    password: "password123", 
    phone: "+91 9876543210", 
    vehicleType: "Bike", 
    vehicleNumber: "RJ-14-SK-2234",
    approvalStatus: "Pending"
  },
  { 
    fullName: "Amit Sharma", 
    email: "amit@example.com", 
    password: "password123", 
    phone: "+91 9123456789", 
    vehicleType: "Van", 
    vehicleNumber: "RJ-14-MV-5567",
    approvalStatus: "Pending"
  },
  { 
    fullName: "Suresh Meena", 
    email: "suresh@example.com", 
    password: "password123", 
    phone: "+91 8887776665", 
    vehicleType: "Bike", 
    vehicleNumber: "RJ-14-BK-9900",
    approvalStatus: "Pending"
  },
  { 
    fullName: "Vikram Singh", 
    email: "vikram@example.com", 
    password: "password123", 
    phone: "+91 7776665554", 
    vehicleType: "Truck", 
    vehicleNumber: "RJ-14-TR-1111",
    approvalStatus: "Approved"
  },
  { 
    fullName: "Navin Gupta", 
    email: "navin@example.com", 
    password: "password123", 
    phone: "+91 6665554443", 
    vehicleType: "Bike", 
    vehicleNumber: "RJ-14-BK-4455",
    approvalStatus: "Pending"
  }
];

async function seedDeliveries() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    // Clear existing (optional, but good for clean demo)
    // await Delivery.deleteMany({ email: { $in: partners.map(p => p.email) } });

    for (const partner of partners) {
      const exists = await Delivery.findOne({ email: partner.email });
      if (!exists) {
        await Delivery.create(partner);
        console.log(`Created partner: ${partner.fullName}`);
      } else {
        console.log(`Partner already exists: ${partner.fullName}`);
      }
    }

    console.log('Seeding complete!');
    process.exit();
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seedDeliveries();
