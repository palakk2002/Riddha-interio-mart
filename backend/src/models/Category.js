const mongoose = require('mongoose');

const SubcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a subcategory name'],
    trim: true
  },
  image: {
    type: String,
    default: ''
  }
});

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters']
  },
  description: {
    type: String,
    required: [false],
    maxlength: [500, 'Description can not be more than 500 characters']
  },
  image: {
    type: String,
    default: 'no-photo.jpg'
  },
  subcategories: [SubcategorySchema],
  productCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true
});

module.exports = mongoose.model('Category', CategorySchema);
