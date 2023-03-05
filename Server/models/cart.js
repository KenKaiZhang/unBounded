import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, href: "Customer" },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, href: "Product" },
      quantity: { type: Number },
      productTotal: { type: Number },
    },
  ],
  subtotal: { type: Number, default: 0 },
});

export default CartSchema;
