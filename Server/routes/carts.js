const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const User = require("../models/user");
const Cart = require("../models/cart");

// Get all carts
router.get("/", async (req, res) => {
  try {
    const all_carts = await Cart.find();
    res.status(200).json(all_carts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a user's cart
router.get("/:userId", getCart, async (req, res) => {
  try {
    const target_cart = req.cart;
    res.status(200).json(target_cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new item to user's cart
router.patch("/:userId/new_item", getCart, async (req, res) => {
  try {
    const target_cart = req.cart;
    console.log(target_cart);
    const wanted_product = await Product.findById(req.body.product);
    const item = {
      product: wanted_product,
      quantity: req.body.quantity,
      product_total: wanted_product.price * req.body.quantity,
    };
    target_cart.total += item.product_total;
    target_cart.items.push(item);
    await target_cart.save();
    res.status(200).json("Cart updated.");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update an item in a user's cart
router.patch("/:userId/old_item", getCart, async (req, res) => {
  try {
    const target_cart = req.cart;
    const target_product = await Product.findById(req.body.product);
    let target_item = null;
    let index;
    for (let i = 0; i < target_cart.items.length; i++) {
      if (target_cart.items[i].product._id.equals(target_product._id)) {
        target_item = target_cart.items[i];
        index = i;
      }
    }

    if (!target_item) res.status(404).json("Item not found in cart.");

    const old_quantity = target_item.quantity;
    target_cart.total -= target_item.product_total;
    target_item.quantity = req.body.quantity;
    target_item.product_total = target_product.price * req.body.quantity;
    console.log(target_product.price, req.body.quantity, old_quantity);
    target_cart.total += target_item.product_total;
    target_cart.items[index] = target_item;

    await target_cart.save();
    res.status(200).json("Cart updated.");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:userId", getCart, async (req, res) => {
  try {
    const target_cart = req.cart;
    const target_product = await Product.findById(req.body.product);
    if (!target_product) res.status(404).json("Product not found in cart.");
    for (let i = 0; i < target_cart.items.length; i++) {
      if (target_cart.items[i].product._id.equals(target_product._id)) {
        target_cart.total -=
          target_cart.items[i].quantity * target_product.price;
        target_cart.items.splice(i, 1);
        await target_cart.save();
        break;
      }
    }
    res.status(200).json("Item removed from cart.");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getCart(req, res, next) {
  try {
    target_user = await User.findById(req.params.userId);
    if (!target_user)
      return res.status(404).json({ message: "Cannot find user." });
    req.cart = await Cart.findById(target_user.cart);
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
