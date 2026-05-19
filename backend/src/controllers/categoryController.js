const Category = require('../models/Category');

// @desc    Get all categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (err) {
    next(err);
  }
};

// @desc    Get category by name (slug)
exports.getCategoryBySlug = async (req, res, next) => {
  try {
    const slug = req.params.slug.replace(/-/g, ' ');
    // Case insensitive match
    const category = await Category.findOne({ name: { $regex: new RegExp(`^${slug}$`, 'i') } });
    
    if (!category) return res.status(404).json({ success: false, error: 'Category not found' });
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single category by ID
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, error: 'Category not found' });
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new category
exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

// @desc    Update category
exports.updateCategory = async (req, res, next) => {
  const mongoose = require('mongoose');
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const Product = require('../models/Product');

    const oldCategory = await Category.findById(req.params.id).session(session);
    if (!oldCategory) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    const oldName = oldCategory.name;

    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      session
    });

    // Cascade name changes to products and catalog if name is updated
    if (req.body.name && req.body.name !== oldName) {
      const Catalog = require('../models/Catalog');
      await Promise.all([
        Product.updateMany(
          { category: oldName },
          { $set: { category: req.body.name } }
        ).session(session),
        Catalog.updateMany(
          { category: oldName },
          { $set: { category: req.body.name } }
        ).session(session)
      ]);
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ success: true, data: category });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

// @desc    Delete category
exports.deleteCategory = async (req, res, next) => {
  try {
    const Product = require('../models/Product');
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, error: 'Category not found' });

    // Safeguard check: reject deletion if active products exist in the category
    const productCount = await Product.countDocuments({ category: category.name });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete category because it has ${productCount} active products associated with it. Please reassign the products first.`
      });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
