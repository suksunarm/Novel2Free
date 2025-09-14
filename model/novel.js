const mongoose = require("mongoose");

const novelSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image_url: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ["Sci-Fi", "Romance","Fantasy","Horror","Comedy"],
    default: "Not-Specified",
  },
});

module.exports = mongoose.model('Novel', novelSchema);