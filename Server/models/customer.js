const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, default: "New Customer" },
  email: { type: String, default: null },
  cart: { type: mongoose.Schema.Types.ObjectId, href: "Cart", default: null },
});

module.exports = mongoose.model("User", userSchema);
