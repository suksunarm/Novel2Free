const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password_hash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  points: {
    type: Number,
    default: 0
  },
  coupons: [{
    coupon_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon'
    },
    status: {
      type: String,
      enum: ['active', 'used'],
      default: 'active'
    }
  }],
  cart_items: [{
    novel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Novel'
    },
    price: {
      type: Number,
      required: true
    }
  }]
});

module.exports = mongoose.model('User', userSchema);