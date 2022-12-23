const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, href: "User" },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, href: "Product" },
      quantity: { type: Number, required: true, default: 0 },
      product_total: { type: Number, default: 0 },
    },
  ],
  total: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model("Cart", cartSchema);
