const mongoose = require('mongoose');
const Category = require('../backend/src/models/Category');
const Product = require('../backend/src/models/Product');
const Catalog = require('../backend/src/models/Catalog');
const Brand = require('../backend/src/models/Brand');
const { updateCategory, deleteCategory } = require('../backend/src/controllers/categoryController');
const { deleteCatalogItem } = require('../backend/src/controllers/catalogController');

const MONGO_URI = 'mongodb://127.0.0.1:27017/riddha_interio_mart'; // Local development db

async function runTests() {
  console.log('Connecting to database...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected!');

  // Clear previous test entities
  await Promise.all([
    Category.deleteMany({ name: { $in: ['TestCategoryOld', 'TestCategoryNew'] } }),
    Catalog.deleteMany({ sku: 'TEST-SKU-999' }),
    Product.deleteMany({ sku: 'TEST-SKU-999' }),
    Brand.deleteMany({ name: 'TestBrandPartner' })
  ]);

  console.log('\n--- SETUP TEST ENVIRONMENT ---');
  
  // 1. Create a Brand Partner
  const brand = await Brand.create({
    name: 'TestBrandPartner',
    image: 'https://via.placeholder.com/100',
    description: 'Test Brand Description'
  });
  console.log(`Created Brand: ${brand.name} (${brand._id})`);

  // 2. Create Category
  const category = await Category.create({
    name: 'TestCategoryOld',
    description: 'Test Description',
    image: 'https://via.placeholder.com/100'
  });
  console.log(`Created Category: ${category.name} (${category._id})`);

  // 3. Create Master Catalog item with Category and SKU
  const catalogItem = await Catalog.create({
    name: 'Test Catalog Product',
    sku: 'TEST-SKU-999',
    brand: brand._id,
    category: 'TestCategoryOld',
    price: 1500,
    stock: 50,
    description: 'Beautiful test item',
    images: ['https://via.placeholder.com/150'],
    material: 'Marble',
    dimensions: '12x12'
  });
  console.log(`Created Catalog Item: ${catalogItem.name} (SKU: ${catalogItem.sku}, Cat: ${catalogItem.category})`);

  // 4. Create Active Shop Product (Inventory) referencing this SKU
  const productItem = await Product.create({
    name: 'Test Active Product',
    sku: 'TEST-SKU-999',
    brand: brand._id,
    category: 'TestCategoryOld',
    price: 1500,
    countInStock: 25,
    description: 'Beautiful test item active',
    images: ['https://via.placeholder.com/150'],
    isApproved: true,
    approvalStatus: 'approved',
    sellerType: 'Admin'
  });
  console.log(`Created Active Store Product: ${productItem.name} (SKU: ${productItem.sku}, Cat: ${productItem.category})`);

  console.log('\n--- TEST CASE 1: CATEGORY NAME RENAME CASCADE ---');
  // We'll mimic the updateCategory express request parameters
  const mockReqUpdate = {
    params: { id: category._id },
    body: { name: 'TestCategoryNew' }
  };
  let mockResJson = null;
  const mockResUpdate = {
    status: (code) => ({
      json: (data) => {
        mockResJson = data;
        return { success: code < 400 };
      }
    })
  };

  await updateCategory(mockReqUpdate, mockResUpdate, (err) => { if (err) throw err; });
  
  // Verify that both Product and Catalog categories updated atomically!
  const updatedCatalog = await Catalog.findOne({ sku: 'TEST-SKU-999' });
  const updatedProduct = await Product.findOne({ sku: 'TEST-SKU-999' });

  console.log(`Catalog Category after update: "${updatedCatalog.category}"`);
  console.log(`Product Category after update: "${updatedProduct.category}"`);

  if (updatedCatalog.category === 'TestCategoryNew' && updatedProduct.category === 'TestCategoryNew') {
    console.log('✅ TEST CASE 1 PASSED: Category cascade successfully renamed both Inventory and Catalog!');
  } else {
    throw new Error('❌ TEST CASE 1 FAILED: Category rename cascade mismatch!');
  }

  console.log('\n--- TEST CASE 2: BLOCK CATEGORY DELETE IF ACTIVE CATALOG EXISTS ---');
  // Let's reload our renamed category id
  const renamedCategory = await Category.findOne({ name: 'TestCategoryNew' });
  
  const mockReqDeleteCat = {
    params: { id: renamedCategory._id }
  };
  let deleteCatError = null;
  const mockResDeleteCat = {
    status: (code) => ({
      json: (data) => {
        deleteCatError = data;
        return { success: code < 400 };
      }
    })
  };

  await deleteCategory(mockReqDeleteCat, mockResDeleteCat, (err) => { if (err) console.error(err); });

  console.log('Delete Category error response:', deleteCatError);
  if (deleteCatError && deleteCatError.success === false && deleteCatError.error.includes('master catalog registry')) {
    console.log('✅ TEST CASE 2 PASSED: Category deletion blocked successfully because catalog registry items exist!');
  } else {
    throw new Error('❌ TEST CASE 2 FAILED: Deletion was not blocked!');
  }

  console.log('\n--- TEST CASE 3: BLOCK CATALOG ITEM DELETE IF SHOP INVENTORY REFERENCES SKU ---');
  const mockReqDeleteCatalog = {
    params: { id: catalogItem._id }
  };
  let deleteCatalogError = null;
  const mockResDeleteCatalog = {
    status: (code) => ({
      json: (data) => {
        deleteCatalogError = data;
        return { success: code < 400 };
      }
    })
  };

  await deleteCatalogItem(mockReqDeleteCatalog, mockResDeleteCatalog, (err) => { if (err) console.error(err); });

  console.log('Delete Catalog error response:', deleteCatalogError);
  if (deleteCatalogError && deleteCatalogError.success === false && deleteCatalogError.error.includes('shop inventory')) {
    console.log('✅ TEST CASE 3 PASSED: Catalog deletion blocked successfully because shop inventory references SKU!');
  } else {
    throw new Error('❌ TEST CASE 3 FAILED: Catalog deletion was not blocked!');
  }

  // Cleanup after verification tests complete
  await Promise.all([
    Category.deleteMany({ name: { $in: ['TestCategoryOld', 'TestCategoryNew'] } }),
    Catalog.deleteMany({ sku: 'TEST-SKU-999' }),
    Product.deleteMany({ sku: 'TEST-SKU-999' }),
    Brand.deleteMany({ name: 'TestBrandPartner' })
  ]);
  
  console.log('\n--- ALL TEST CASES PASSED SUCCESSFULLY ---');
  await mongoose.connection.close();
  process.exit(0);
}

runTests().catch(async (err) => {
  console.error('\n❌ INTEGRATION TEST FAILED:', err.message);
  await mongoose.connection.close();
  process.exit(1);
});
