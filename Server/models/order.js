const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  orderId: { type: String, requried: true },
  orderItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, href: "Product" },
      quantity: { type: Number, required: true, default: 0 },
      product_total: { type: Number, default: 0 },
    },
  ],
  orderTotal: { type: Number, required: true, default: 0 },
  orderDate: { type: String, required: true },
  orderAddress: { type: String, required: true },
});

module.exports = mongoose.model("Order", orderSchema);
