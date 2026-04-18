const mongoose = require('mongoose');
const FavouriteSection = require('../models/FavouriteSection');
const Category = require('../models/Category');
const Product = require('../models/Product');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const normalizeText = (value) => String(value || '').trim().toLowerCase();

const normalizeId = (item) => {
  if (!item) return '';
  if (typeof item === 'object') return String(item._id || item.id || '').trim();
  return String(item).trim();
};

const normalizeIdArray = (value) => {
  if (!value) return [];
  const items = Array.isArray(value) ? value : [value];
  return [...new Set(items.map(normalizeId).filter(Boolean))];
};

const normalizeItems = (value) => {
  if (!value) return [];
  const items = Array.isArray(value) ? value : [value];

  return items
    .map((item) => {
      if (!item) return null;

      const categoryId = normalizeId(item.categoryId || item.category);
      const productIds = normalizeIdArray(item.productIds || item.products);

      if (!categoryId) return null;

      const result = {
        categoryId,
        productIds
      };

      // Only include _id if it's a valid MongoDB ObjectId
      const id = item._id || item.id;
      if (id && isValidObjectId(id)) {
        result._id = id;
      }

      return result;
    })
    .filter(Boolean);
};

const buildFavouriteSectionPayload = (body = {}) => ({
  heading: body.heading,
  subheading: body.subheading,
  displayOrder: Number.isFinite(Number(body.displayOrder)) ? Number(body.displayOrder) : 0,
  isActive: body.isActive === false || body.isActive === 'false' ? false : true,
  items: normalizeItems(body.items)
});

const populateSection = (query) =>
  query.populate('items.categoryId').populate('items.productIds');

const validatePayload = async (payload) => {
  if (!payload.heading || !String(payload.heading).trim()) {
    console.log('Validation failed: Missing heading');
    return 'Please add a heading for the favourite section.';
  }

  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    console.log('Validation failed: Empty items array');
    return 'Please add at least one category block.';
  }

  const categoryIds = payload.items.map((item) => String(item.categoryId));
  if (new Set(categoryIds).size !== categoryIds.length) {
    console.log('Validation failed: Duplicate categories', categoryIds);
    return 'Each category can only appear once in a favourite section.';
  }

  const categories = await Category.find({ _id: { $in: categoryIds } }).select('name');
  if (categories.length !== categoryIds.length) {
    console.log('Validation failed: Categories mismatch', {
      expected: categoryIds.length,
      found: categories.length,
      categoryIds
    });
    return 'One or more selected categories are no longer available.';
  }

  const categoryNameMap = new Map(
    categories.map((category) => [String(category._id), normalizeText(category.name)])
  );

  const productIds = [...new Set(payload.items.flatMap((item) => item.productIds))];
  const products = await Product.find({ _id: { $in: productIds } }).select('category name');

  if (products.length !== productIds.length) {
    console.log('Validation failed: Products mismatch', {
      expected: productIds.length,
      found: products.length,
      productIds
    });
    return 'One or more selected products are no longer available.';
  }

  const productMap = new Map(products.map((product) => [String(product._id), product]));

  for (const item of payload.items) {
    if (!item.productIds || item.productIds.length === 0) {
      console.log('Validation failed: Category block with no products', item.categoryId);
      return 'Please select at least one product for every category block.';
    }

    const categoryName = categoryNameMap.get(String(item.categoryId));
    const invalidProduct = item.productIds.find((productId) => {
      const product = productMap.get(String(productId));
      if (!product) return true;
      const productCategory = normalizeText(product.category);
      const isMatch = productCategory === categoryName;
      
      if (!isMatch) {
        console.log('Validation failed: Product category mismatch', {
          productId,
          productName: product.name,
          productCategory,
          expectedCategoryName: categoryName
        });
      }
      return !isMatch;
    });

    if (invalidProduct) {
      const product = productMap.get(String(invalidProduct));
      const productCategory = normalizeText(product?.category);
      return `Product "${product?.name}" must belong to category "${categoryName}" (found "${productCategory}").`;
    }
  }

  return null;
};

// @desc    Get all favourite sections
// @route   GET /api/favourite-section
// @access  Public
exports.getFavouriteSections = async (req, res) => {
  try {
    const sections = await populateSection(
      FavouriteSection.find().sort({ displayOrder: 1, createdAt: -1 })
    );

    res.status(200).json({
      success: true,
      count: sections.length,
      data: sections
    });
  } catch (error) {
    console.error('Get favourite sections error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single favourite section
// @route   GET /api/favourite-section/:id
// @access  Public
exports.getFavouriteSectionById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid section ID' });
    }

    const section = await populateSection(FavouriteSection.findById(req.params.id));
    if (!section) {
      return res.status(404).json({ success: false, error: 'Favourite section not found' });
    }

    res.status(200).json({
      success: true,
      data: section
    });
  } catch (error) {
    console.error('Get favourite section by id error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create favourite section
// @route   POST /api/favourite-section
// @access  Private/Admin
exports.createFavouriteSection = async (req, res) => {
  try {
    const payload = buildFavouriteSectionPayload(req.body);
    const validationError = await validatePayload(payload);

    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    const section = await FavouriteSection.create(payload);

    res.status(201).json({
      success: true,
      data: section
    });
  } catch (error) {
    console.error('Create favourite section error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update favourite section
// @route   PUT /api/favourite-section/:id
// @access  Private/Admin
exports.updateFavouriteSection = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid section ID' });
    }

    const payload = buildFavouriteSectionPayload(req.body);
    const validationError = await validatePayload(payload);

    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    const section = await FavouriteSection.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    });

    if (!section) {
      return res.status(404).json({ success: false, error: 'Favourite section not found' });
    }

    res.status(200).json({
      success: true,
      data: section
    });
  } catch (error) {
    console.error('Update favourite section error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete favourite section
// @route   DELETE /api/favourite-section/:id
// @access  Private/Admin
exports.deleteFavouriteSection = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid section ID' });
    }

    const section = await FavouriteSection.findByIdAndDelete(req.params.id);
    if (!section) {
      return res.status(404).json({ success: false, error: 'Favourite section not found' });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete favourite section error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
