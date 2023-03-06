import express from "express";
import { Cart, Customer, Product } from "../database.js";

const router = express.Router();

// Get customer information
router.get("/:customerId", getCustomer, async (req, res) => {
  try {
    const targetCustomer = res.customer;
    res.status(200).json(targetCustomer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get customer cart
router.get("/:customerId/cart", getCustomer, async (req, res) => {
  try {
    const targetCart = res.cart;
    res.status(200).json(targetCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Make a new customer and assign a new cart
router.post("/", async (req, res) => {
  try {
    console.log("NEW CUSTOMER");
    const newCustomer = new Customer({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    });
    const newCart = new Cart({
      customer: newCustomer._id,
    });
    newCustomer.cart = newCart._id;

    await newCustomer.save();
    await newCart.save();
    res.status(201).json(newCustomer._id);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Change customer details
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

// Add item to cart
router.patch("/:customerId/addItem", getCustomer, async (req, res) => {
  try {
    const targetCart = res.cart;
    const cartItems = targetCart.items;
    const wantedProduct = await Product.findById(req.body.product);

    const match = cartItems.filter((obj) => {
      return obj.product.equals(wantedProduct._id);
    })[0];
    if (match) {
      match.quantity += 1;
      match.productTotal = twoDecimalOnly(
        match.productTotal + wantedProduct.price
      );
    } else {
      const newItem = {
        product: wantedProduct,
        quantity: req.body.quantity,
        productTotal: wantedProduct.price * req.body.quantity,
      };
      cartItems.push(newItem);
    }
    updateCartTotal(targetCart);
    await targetCart.save();
    res.status(202).json({ message: "Item successfully added to cart." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Change item quantity in cart
router.patch("/:customerId/changeItem", getCustomer, async (req, res) => {
  try {
    const targetCart = res.cart;
    const wantedItem = targetCart.items.find(
      (item) => item._id == req.body.itemId
    );
    const itemProduct = await Product.findById(wantedItem.product);
    const productPrice = Number(itemProduct.price);
    if (req.body.quantity > 0) {
      wantedItem.quantity = req.body.quantity;
      wantedItem.productTotal = twoDecimalOnly(
        wantedItem.quantity * productPrice
      );
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
// Give customer a new cart
router.patch("/:customerId/newCart", getCustomer, async (req, res) => {
  try {
    const targetCart = res.cart;
    targetCart.items = [];
    targetCart.subtotal = 0;
    await targetCart.save();
    res.status(200).json(targetCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getCustomer(req, res, next) {
  try {
    const targetCustomer = await Customer.findById(req.params.customerId);
    if (!targetCustomer)
      return res.status(404).json({ message: "Cannot find customer." });
    res.customer = targetCustomer;
    res.cart = await Cart.findById(targetCustomer.cart);
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

function updateCartTotal(targetCart) {
  const targetCartItems = targetCart.items;
  const subtotal = targetCartItems.reduce((sum, item) => {
    return sum + item.productTotal;
  }, 0);
  targetCart.subtotal = twoDecimalOnly(subtotal);
}

function twoDecimalOnly(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export default router;
