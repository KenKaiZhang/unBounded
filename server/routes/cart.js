import express from "express";
import { Cart, Product } from "../database.js";

const router = express.Router();

router.get("/:cartId", getCart, async (req, res) => {
  try {
    const targetCart = res.cart;
    res.status(200).json(targetCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("NEW SESSION");
    const newCart = new Cart();
    await newCart.save();
    console.log(newCart._id);
    res.status(201).json(newCart._id);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Change attributes of cart
router.patch("/:cartId", getCart, async (req, res) => {
  try {
    const targetCart = res.cart;
    if (req.body.ownerName) targetCart.ownerName = req.body.ownerName;
    if (req.body.ownerEmail) targetCart.ownerEmail = req.body.ownerEmail;
    await targetCart.save();
    res.status(200).json("Customer information successfully updated.");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add item to cart
router.patch("/:cartId/addItem", getCart, async (req, res) => {
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
router.patch("/:cartId/changeItem", getCart, async (req, res) => {
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
router.patch("/:cartId/newCart", getCart, async (req, res) => {
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

async function getCart(req, res, next) {
  try {
    const targetCart = await Cart.findById(req.params.cartId);
    if (!targetCart)
      return res.status(404).json({ message: "Cannot find cart." });
    res.cart = targetCart;
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
