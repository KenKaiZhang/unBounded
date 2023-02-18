const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema({
  owner_name: { type: String, require: true },
  store: { type: mongoose.Schema.Types.ObjectId, href: "Store", default: null },
  store_name: { type: String, require: true },
  store_address: { type: String, require: true },
  email: { type: String, require: true },
  phone: { type: String, require: true },
  message: { type: String, require: true },
});

module.exports = mongoose.model("Partner", partnerSchema);
