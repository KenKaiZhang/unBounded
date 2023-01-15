const express = require("express");
const router = express.Router();
const Store = require("../models/store");
const Product = require("../models/product");

// Get all products
router.get("/", async (req, res) => {
  try {
    const all_products = await Product.find();
    res.status(200).json(all_products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific product
router.get("/:productId", getProduct, async (req, res) => {
  try {
    res.status(200).json(res.product);
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

// Getting all the products filtered by gender adn style
router.get("/gender/:gender/style/:style", async (req, res) => {
  try {
    let productQuery;
    if (req.params.style == "all") {
      productQuery = { gender: req.params.gender };
    } else {
      productQuery = { gender: req.params.gender, style: req.params.style };
    }
    res.status(200).json(await Product.find(productQuery));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Adding a product
router.post("/", async (req, res) => {
  try {
    console.log(req.body.store);
    const target_store = await Store.findById(req.body.store);
    console.log(target_store);
    if (!target_store) res.status(404).json("Store not found.");

    const new_product = new Product({
      store: target_store,
      name: req.body.name,
      price: req.body.price,
      image_url: req.body.image_url,
      gender: req.body.gender,
      style: req.body.style,
      description: req.body.description,
    });
    await new_product.save();

    console.log(target_store.male_styles.indexOf(req.body.style) == -1);
    if (req.body.gender == "male") {
      if (target_store.male_styles.indexOf(req.body.style) == -1) {
        target_store.male_styles.push(req.body.style);
        target_store.male_styles.sort();
      }
    } else if (req.body.gender == "female") {
      if (target_store.female_styles.indexOf(req.body.style) == -1) {
        target_store.female_styles.push(req.body.style);
        target_store.female_styles.sort();
      }
    }

    target_store.num_products++;
    target_store.products.push(new_product);
    result = await target_store.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Updating a specific product from a store
router.patch("/:productId", getProduct, async (req, res) => {
  try {
    const target_product = res.product;
    if (req.body.name) target_product.name = req.body.name;
    if (req.body.price) target_product.price = req.body.price;
    if (req.body.image_url) target_product.image_url = req.body.image_url;
    if (req.body.gender) target_product.gender = req.body.gender;
    if (req.body.style) target_product.style = req.body.style;
    if (req.body.description) target_product.description = req.body.description;
    if (req.body.store || req.body.store_id)
      res.status(400).json({
        message: "Cannot change item's store location.",
      });
    await target_product.save();
    res.status(200).json({ message: "Product updated." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove a specific product
router.delete("/:productId", getProduct, async (req, res) => {
  try {
    const target_product = res.product;
    const target_store = await Store.findById(target_product.store);
    if (target_store) {
      for (let i = 0; i < target_store.num_products; i++) {
        if (target_store.products[i]._id.equals(target_product._id)) {
          target_store.products.splice(i, 1);
          target_store.num_products--;
          await target_store.save();
          break;
        }
      }
    }

    await target_product.remove();
    res.status(200).json({ message: "Product removed from store." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware
async function getProduct(req, res, next) {
  try {
    const target_product = await Product.findById(req.params.productId);
    if (!target_product)
      return res.status(404).json({ message: "Cannot find product." });
    res.product = target_product;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
