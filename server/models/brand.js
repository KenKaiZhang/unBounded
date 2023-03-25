import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  country: { type: String },
  collections: [{ type: String }],
  image: { type: String },
  description: { type: String },
  yearlySales: [
    {
      year: { type: Number },
      month: { type: Number },
      day: { type: Number },
      sales: { type: Number, default: 0 },
    },
  ],
});

export default BrandSchema;
