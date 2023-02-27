import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String },
  price: { type: Number },
  brand: { type: mongoose.Schema.Types.ObjectId, href: "Brand" },
  col: { type: String },
  image: { type: String },
  style: { type: String },
  gender: { type: String },
  description: { type: String },
});

export default ProductSchema;
