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
  { name: 'Kohler', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Kohler_Co_logo.svg/512px-Kohler_Co_logo.svg.png' },
  { name: 'Asian Paints', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Asian_Paints_logo.svg/512px-Asian_Paints_logo.svg.png' },
  { name: 'Jaquar', url: 'https://logoverse.com/wp-content/uploads/2023/12/Jaquar-Logo-PNG.png' },
  { name: 'Heffele', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/H%C3%A4fele_Logo.svg/512px-H%C3%A4fele_Logo.svg.png' },
  { name: 'IKEA', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Ikea_logo.svg/512px-Ikea_logo.svg.png' },
  { name: 'Yale', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Yale_logo.svg/512px-Yale_logo.svg.png' },
  { name: 'Philips', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Philips_logo.svg/512px-Philips_logo.svg.png' },
  { name: 'Stanley', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Stanley_logo.svg/512px-Stanley_logo.svg.png' },
  { name: 'Saint-Gobain', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Saint-Gobain_logo.svg/512px-Saint-Gobain_logo.svg.png' },
  { name: 'Godrej', url: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/Godrej_Logo.svg/512px-Godrej_Logo.svg.png' }
];

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
        console.log(`Done: ${source.name} -> ${result.secure_url}`);
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
