const express = require("express");
const router = express.Router();
const Product = require("../models/product");
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
    const target_user = res.user;
    res.status(200).json(target_user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a user's cart
router.get("/:userId/cart", getUser, async (req, res) => {
  try {
    const target_cart = res.cart;
    res.status(200).json(target_cart);
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
    const newUser = await new_user.save();

    new_cart.user = new_user;
    await new_cart.save();

    res.status(200).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add item to user cart
router.post("/:userId/add_item", getUser, async (req, res) => {
  try {
    const target_cart = res.cart;
    const wantedProduct = await Product.findById(req.body.product);
    const items = target_cart.items;

    const match = items.filter((obj) => {
      return obj.product.equals(wantedProduct._id);
    })[0];
    if (match) {
      match.quantity++;
      match.product_total += wantedProduct.price;
    } else {
      const item = {
        product: wantedProduct,
        quantity: req.body.quantity,
        product_total: wantedProduct.price * req.body.quantity,
      };
      target_cart.items.push(item);
    }
    updateCartTotal(target_cart);
    await target_cart.save();
    res.status(200).json("User cart updated.");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove item from user cart
router.post("/:userId/change_item", getUser, async (req, res) => {
  try {
    const target_cart = res.cart;
    const wantedItem = target_cart.items.find(
      (item) => item._id == req.body.itemId
    );
    const itemProduct = await Product.findById(wantedItem.product);
    const productPrice = Number(itemProduct.price);

    if (req.body.quantity > 0) {
      wantedItem.quantity = req.body.quantity;
      wantedItem.product_total = wantedItem.quantity * productPrice;
    } else {
      const index = target_cart.items.findIndex(
        (item) => item._id == req.body.itemId
      );
      target_cart.items.splice(index, 1);
    }
    updateCartTotal(target_cart);
    console.log(target_cart.total);
    await target_cart.save();

    res.status(200).json(wantedItem.product_total);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a specific user's information
router.patch("/:userId", getUser, async (req, res) => {
  try {
    const target_user = res.user;
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
    const target_user = res.user;
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
    target_user = await User.findById(req.params.userId);
    if (!target_user)
      return res.status(404).json({ message: "Cannot find user." });
    res.user = target_user;
    res.cart = await Cart.findById(target_user.cart);
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

function updateCartTotal(target_cart) {
  const targetCartItems = target_cart.items;
  let subtotal = 0;
  targetCartItems.map((item) => {
    subtotal += item.product_total;
  });
  console.log(subtotal);
  target_cart.total = subtotal;
}

module.exports = router;
