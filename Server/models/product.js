const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  store: { type: mongoose.Schema.Types.ObjectId, href: "Store" },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image_url: { type: String },
  gender: { type: String, required: true },
  style: { type: String, required: true },
  description: { type: String },
});

module.exports = mongoose.model("Product", productSchema);
