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
  { name: 'Asian Paints', url: 'https://seeklogo.com/images/A/asian-paints-logo-E8E4F8E4F8-seeklogo.com.png' }, // retrying
  { name: 'Jaquar', url: 'https://logoverse.com/wp-content/uploads/2023/12/Jaquar-Logo-PNG.png' },
  { name: 'Heffele', url: 'https://logodownload.org/wp-content/uploads/2019/08/hafele-logo.png' },
  { name: 'IKEA', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Ikea_logo.svg/512px-Ikea_logo.svg.png' },
  { name: 'Yale', url: 'https://logodownload.org/wp-content/uploads/2019/12/yale-logo.png' },
  { name: 'Philips', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Philips_logo.svg/512px-Philips_logo.svg.png' },
  { name: 'Stanley', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Stanley_logo.svg/512px-Stanley_logo.svg.png' },
  { name: 'Saint-Gobain', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Saint-Gobain_logo.svg/512px-Saint-Gobain_logo.svg.png' },
  { name: 'Godrej', url: 'https://logoverse.com/wp-content/uploads/2024/01/Godrej-Logo-Vector-PNG.png' }
];

const uploadAndFixLogos = async () => {
  try {
    await connectDB();
    for (const source of logoSources) {
      console.log(`Processing ${source.name}...`);
      try {
        const result = await cloudinary.uploader.upload(source.url, {
          folder: 'riddha_mart/brands',
          public_id: `${source.name.toLowerCase().replace(/\s+/g, '_')}_logo`,
          overwrite: true
        });
        await Brand.findOneAndUpdate({ name: source.name }, { logo: result.secure_url });
        console.log(`Success: ${source.name}`);
      } catch (err) {
        console.warn(`Failed ${source.name} with ${source.url}, trying fallback...`);
        // Final fallback: professional UI avatar if everything else fails
        try {
           const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(source.name)}&background=1A1A1A&color=FFFFFF&size=512&bold=true&font-size=0.33`;
           const result = await cloudinary.uploader.upload(fallbackUrl, {
              folder: 'riddha_mart/brands',
              public_id: `${source.name.toLowerCase().replace(/\s+/g, '_')}_logo_fallback`,
              overwrite: true
           });
           await Brand.findOneAndUpdate({ name: source.name }, { logo: result.secure_url });
           console.log(`Success (Fallback): ${source.name}`);
        } catch (fallbackErr) {
           console.error(`TOTAL CRITICAL FAILURE for ${source.name}`);
        }
      }
    }
    process.exit(0);
  } catch (err) {
    process.exit(1);
  }
};

uploadAndFixLogos();
