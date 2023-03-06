import mongoose from "mongoose";

const PartnerSchema = new mongoose.Schema({
  owner_name: { type: String, require: true },
  store: { type: mongoose.Schema.Types.ObjectId, href: "Store", default: null },
  store_name: { type: String, require: true },
  store_address: { type: String, require: true },
  email: { type: String, require: true },
  phone: { type: String, require: true },
  message: { type: String, require: true },
  validated: { type: Boolean, default: false, require: true },
});

export default PartnerSchema;
