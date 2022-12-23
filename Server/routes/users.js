const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Cart = require("../models/cart");

// Get all users
router.get("/", async (req, res) => {
  try {
    const all_users = await User.find();
    res.status(200).json(all_users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific user
router.get("/:userId", getUser, async (req, res) => {
  try {
    const target_user = req.user;
    res.status(200).json(target_user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a user
router.post("/", async (req, res) => {
  try {
    const new_cart = new Cart({
      user: null,
      items: [],
      total: 0,
    });

    const new_user = new User({
      name: req.body.name,
      email: req.body.email,
      cart: new_cart._id,
    });
    await new_user.save();

    new_cart.user = new_user;
    result = await new_cart.save();

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a specific user's information
router.patch("/:userId", getUser, async (req, res) => {
  try {
    const target_user = req.user;
    if (req.body.name) target_user.name = req.body.name;
    if (req.body.email) target_user.email = req.body.email;
    await target_user.save();
    res.status(200).json("User updated.");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove a specific user
router.delete("/:userId", getUser, async (req, res) => {
  try {
    const target_user = req.user;
    const target_cart = Cart.findById(target_user.cart);

    await target_cart.remove();
    await target_user.remove();
    res.status(200).json("User removed.");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getUser(req, res, next) {
  try {
    target_user = await User.findById(req.params.productId);
    if (!target_user)
      return res.status(404).json({ message: "Cannot find user." });
    res.user = target_user;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
