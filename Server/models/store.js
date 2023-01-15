const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  num_products: { type: Number, default: 0 },
  store_image: { type: String, default: null },
  male_styles: { type: Array, default: [] },
  female_styles: { type: Array, default: [] },
  products: [{ type: mongoose.Schema.Types.ObjectId, href: "Product" }],
});

module.exports = mongoose.model("Store", storeSchema);