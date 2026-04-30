const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.ObjectId,
    required: true,
    refPath: 'sellerType'
  },
  sellerType: {
    type: String,
    required: true,
    enum: ['Seller', 'Admin'],
    default: 'Seller'
  },
  orderItems: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
      },
      seller: {
        type: mongoose.Schema.ObjectId,
        required: true,
        refPath: 'orderItems.sellerType'
      },
      sellerType: {
        type: String,
        required: true,
        enum: ['Seller', 'Admin'],
        default: 'Seller'
      }
    }
  ],
  shippingAddress: {
    fullName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    pincode: { type: String, required: true },
    city: { type: String, required: true },
    fullAddress: { type: String, required: true },
    landmark: { type: String }
  },
  paymentMethod: {
    type: String,
    required: true,
    default: 'Online'
  },
  paymentResult: {
    id: { type: String },
    status: { type: String },
    update_time: { type: String },
    email_address: { type: String }
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  paidAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  deliveryBoy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Delivery'
  },
  deliveryStatus: {
    type: String,
    enum: ['None', 'Pending', 'Accepted', 'Picked', 'Out for Delivery', 'Delivered', 'Rejected'],
    default: 'None'
  },
  deliveryAssignmentTime: {
    type: Date
  },
  businessDetails: {
    shopName: String,
    gstNumber: String,
    taxationCode: String
  },
  isCashDeposited: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);
