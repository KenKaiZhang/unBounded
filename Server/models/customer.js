import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  cart: { type: mongoose.Schema.Types.ObjectId, href: "Cart" },
});

export default CustomerSchema;
