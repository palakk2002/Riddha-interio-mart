const mongoose = require('mongoose');
const User = require('../backend/src/models/User');
require('dotenv').config({ path: '../backend/.env' });

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    const users = await User.find({});
    console.log(`Total Users found: ${users.length}`);
    users.forEach(u => {
      console.log(`- ${u.fullName} (${u.email}) [Role: ${u.role}, Type: ${u.userType}]`);
    });
    
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkUsers();
