const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a brand name'],
      unique: true,
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },
    logo: {
      type: String,
      default: ''
    },
    offer: {
      type: String,
      default: ''
    },
    banners: {
      type: [String],
      default: []
    },
    categories: [
      {
        name: String,
        image: String,
        slug: String
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Create brand slug from the name
brandSchema.pre('save', async function() {
  if (!this.isModified('name')) return;
  this.slug = this.name
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
});

module.exports = mongoose.model('Brand', brandSchema);
