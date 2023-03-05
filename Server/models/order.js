import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerName: { type: String },
  customerCart: { type: mongoose.Schema.Types.ObjectId, href: "Cart" },
  orderId: { type: String },
  orderTotal: { type: Number, required: true, default: 0 },
  orderDate: { type: String, required: true },
  orderAddress: { type: String, required: true },
});

export default orderSchema;
