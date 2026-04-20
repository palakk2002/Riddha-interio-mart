const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const Brand = require('./src/models/Brand');
const connectDB = require('./src/config/db');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const logoSources = [
  { name: 'Yale', url: 'https://seeklogo.com/images/Y/yale-logo-66D60C0345-seeklogo.com.png' },
  { name: 'Philips', url: 'https://seeklogo.com/images/P/philips-logo-7F4AFE3725-seeklogo.com.png' },
  { name: 'Stanley', url: 'https://seeklogo.com/images/S/stanley-logo-975979C1DE-seeklogo.com.png' },
  { name: 'Saint-Gobain', url: 'https://seeklogo.com/images/S/saint-gobain-logo-650A195E6F-seeklogo.com.png' },
  { name: 'Godrej', url: 'https://seeklogo.com/images/G/godrej-logo-C1CDA29E0B-seeklogo.com.png' }
];

const sleep = ms => new Promise(res => setTimeout(res, ms));

const uploadAndFixLogos = async () => {
  try {
    await connectDB();
    for (const source of logoSources) {
      console.log(`Uploading ${source.name}...`);
      try {
        const result = await cloudinary.uploader.upload(source.url, {
          folder: 'riddha_mart/brands',
          public_id: `${source.name.toLowerCase().replace(/\s+/g, '_')}_logo`,
          overwrite: true
        });
        await Brand.findOneAndUpdate({ name: source.name }, { logo: result.secure_url });
        console.log(`Done: ${source.name}`);
        await sleep(2000); // Wait 2s between uploads
      } catch (err) {
        console.error(`Failed ${source.name}:`, err.message);
      }
    }
    process.exit(0);
  } catch (err) {
    process.exit(1);
  }
};

uploadAndFixLogos();
