const express = require("express");
const router = express.Router();
const Store = require("../models/store");
const Product = require("../models/product");

// Get all products
router.get("/", async (req, res) => {
  try {
    const allProducts = await Product.find();
    res.status(200).json(allProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific product
router.get("/:productId", getProduct, async (req, res) => {
  try {
    const targetProduct = res.product;
    res.status(200).json(targetProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting all the styles added
router.get("/style/:gender", async (req, res) => {
  try {
    const query = { gender: req.params.gender };
    const allStyles = await Product.distinct("style", query);
    res.status(200).json(allStyles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting all the products filtered by gender and style
router.get("/gender/:gender/style/:style", async (req, res) => {
  try {
    let productQuery;
    if (req.params.style == "all") {
      productQuery = { gender: req.params.gender };
    } else {
      productQuery = { gender: req.params.gender, style: req.params.style };
    }
    const targetProducts = await Product.find(productQuery);
    res.status(200).json(targetProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Adding a product
router.post("/", async (req, res) => {
  try {
    const targetStore = await Store.findById(req.body.store);
    if (!targetStore) res.status(404).json("Product's store not found.");

    const newProduct = new Product({
      store: targetStore,
      name: req.body.name,
      price: req.body.price,
      image_url: req.body.image_url,
      gender: req.body.gender,
      style: req.body.style,
      description: req.body.description,
    });
    await newProduct.save();

    targetStore.num_products++;
    targetStore.products.push(newProduct);
    await targetStore.save();
    res.status(201).json("New product successfully created.");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Updating a specific product from a store
router.patch("/:productId", getProduct, async (req, res) => {
  try {
    const targetProduct = res.product;
    if (req.body.name) targetProduct.name = req.body.name;
    if (req.body.price) targetProduct.price = req.body.price;
    if (req.body.image_url) targetProduct.image_url = req.body.image_url;
    if (req.body.gender) targetProduct.gender = req.body.gender;
    if (req.body.style) targetProduct.style = req.body.style;
    if (req.body.description) targetProduct.description = req.body.description;
    if (req.body.store || req.body.store_id)
      res.status(400).json("Changing product's store not allowed.");
    await targetProduct.save();
    res.status(200).json("Product succcessfully updated.");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove a specific product
router.delete("/:productId", getProduct, async (req, res) => {
  try {
    const targetProduct = res.product;
    const targetStore = await Store.findById(targetProduct.store);
    if (targetStore) {
      for (let i = 0; i < targetStore.num_products; i++) {
        if (targetStore.products[i]._id.equals(targetProduct._id)) {
          targetStore.products.splice(i, 1);
          targetStore.num_products--;
          await targetStore.save();
          break;
        }
      }
    }
    await targetProduct.remove();
    res.status(200).json("Product successfully removed.");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware
async function getProduct(req, res, next) {
  try {
    const targetProduct = await Product.findById(req.params.productId);
    if (!targetProduct)
      return res.status(404).json({ message: "Cannot find product." });
    res.product = targetProduct;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
