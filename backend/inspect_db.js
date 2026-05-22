const mongoose = require('mongoose');
const Category = require('./src/models/Category');

const uri = "mongodb+srv://priyankpatel0280_db_user:bbsd2002@cluster0.kclckbu.mongodb.net/test?appName=Cluster0";

async function run() {
  try {
    await mongoose.connect(uri);
    console.log("Connected successfully to MongoDB.");
    
    const categories = await Category.find();
    console.log(`Found ${categories.length} categories.`);
    for (const cat of categories) {
      console.log(`\nCategory: ${cat.name}`);
      console.log(`Subcategories count: ${cat.subcategories?.length || 0}`);
      if (cat.subcategories) {
        for (const sub of cat.subcategories) {
          console.log(`  - Subcategory: ${sub.name}`);
          console.log(`    Sub-subcategories:`, sub.subsubcategories);
        }
      }
    }
  } catch (err) {
    console.error("Error inspecting database:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

run();
