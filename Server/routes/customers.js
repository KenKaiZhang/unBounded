const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Customer = require("../models/customer");
const Cart = require("../models/cart");

// Get all customers
router.get("/", async (req, res) => {
  try {
    const allCustomers = await Customer.find();
    res.status(200).json(allCustomers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific customer
router.get("/:customerId", getCustomer, async (req, res) => {
  try {
    const targetCustomer = res.customer;
    res.status(200).json(targetCustomer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get customer's cart
router.get("/:customerId/cart", getCustomer, async (req, res) => {
  try {
    const targetCart = res.cart;
    res.status(200).json(targetCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a customer
router.post("/", async (req, res) => {
  console.log("ADDING CUSTOMER");
  try {
    // Make a new cart for customer.
    const newCart = new Cart({
      user: null,
      items: [],
      total: 0,
    });

    // Make a new customer and link cart.
    const newCustomer = new Customer({
      name: req.body.name,
      email: req.body.email,
      cart: newCart._id,
    });
    await newCustomer.save();

    // Link customer to cart.
    newCart.user = newCustomer;
    await newCart.save();
    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add item to customer's cart
router.post("/:customerId/add_item", getCustomer, async (req, res) => {
  try {
    const targetCart = res.cart;
    const wantedProduct = await Product.findById(req.body.product);
    const items = targetCart.items;

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
      targetCart.items.push(item);
    }
    updateCartTotal(targetCart);
    await targetCart.save();
    res.status(202).json(`Item successfully added to cart.`);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Change item quantity from customer's cart
router.post("/:customerId/change_item", getCustomer, async (req, res) => {
  try {
    const targetCart = res.cart;
    const wantedItem = targetCart.items.find(
      (item) => item._id == req.body.itemId
    );
    const itemProduct = await Product.findById(wantedItem.product);
    const productPrice = Number(itemProduct.price);

    if (req.body.quantity > 0) {
      wantedItem.quantity = req.body.quantity;
      wantedItem.product_total = wantedItem.quantity * productPrice;
    } else {
      const index = targetCart.items.findIndex(
        (item) => item._id == req.body.itemId
      );
      targetCart.items.splice(index, 1);
    }
    updateCartTotal(targetCart);
    await targetCart.save();
    res.status(200).json(wantedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update customer information
router.patch("/:customerId", getCustomer, async (req, res) => {
  try {
    const targetCustomer = res.customer;
    if (req.body.name) targetCustomer.name = req.body.name;
    if (req.body.email) targetCustomer.email = req.body.email;
    await targetCustomer.save();
    res.status(200).json("Customer information successfully updated.");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Clear customer's cart
router.patch("/:customerId/new_cart", getCustomer, async (req, res) => {
  try {
    const targetCart = res.cart;
    targetCart.items = [];
    targetCart.total = 0;
    await targetCart.save();
    res.status(200).json(targetCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove a customer
router.delete("/:customerId", getCustomer, async (req, res) => {
  try {
    const targetCustomer = res.user;
    const targetCart = Cart.findById(targetCustomer.cart);

    await targetCart.remove();
    await targetCustomer.remove();
    res.status(200).json("Customer successfully removed.");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getCustomer(req, res, next) {
  try {
    const targetCustomer = await Customer.findById(req.params.customerId);
    if (!targetCustomer)
      return res
        .status(404)
        .json({ message: "Cannot find customer with associate id." });
    res.customer = targetCustomer;
    res.cart = await Cart.findById(targetCustomer.cart);
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

function updateCartTotal(targetCart) {
  const targetCartItems = targetCart.items;
  targetCart.total = targetCartItems.reduce((sum, item) => {
    return sum + item.product_total;
  }, 0);
}

module.exports = router;
