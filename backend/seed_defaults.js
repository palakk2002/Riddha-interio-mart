const mongoose = require('mongoose');
require('./src/utils/seederGuard')('seed_defaults.js');
require('dotenv').config();
const Admin = require('./src/models/Admin');
const User = require('./src/models/User');

const seedDefaults = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    let admin = await Admin.findOne({ email: 'riddhamart@gmail.com' });
    if (!admin) {
      admin = await Admin.create({
        fullName: 'Riddha Admin',
        email: 'riddhamart@gmail.com',
        password: '123456',
        type: 'superadmin'
      });
      console.log('Default Admin created.');
    } else {
      console.log('Default Admin already exists.');
    }

    let user = await User.findOne({ email: 'user@gmail.com' });
    if (!user) {
      user = await User.create({
        fullName: 'Riddha User',
        email: 'user@gmail.com',
        password: '123456',
        userType: 'customer'
      });
      console.log('Default User created.');
    } else {
      console.log('Default User already exists.');
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding defaults:', error);
    process.exit(1);
  }
};

seedDefaults();
