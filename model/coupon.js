const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  Name: {
    type: String,
    require: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  points: {
    type: Number,
    required: true
  },
});

module.exports = mongoose.model('Coupon', couponSchema);