const express = require("express");
const router = express.Router();
const Store = require("../models/store");
const Product = require("../models/product");

// Getting all the stores
router.get("/", async (req, res) => {
  try {
    const all_stores = await Store.find();
    res.status(200).json(all_stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting a specific store
router.get("/:storeId", getStore, async (req, res) => {
  try {
    res.status(200).json(res.store);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting products from a specific store
router.get("/:storeId/products", getStore, async (req, res) => {
  try {
    console.log(res.store.products);
    const storeProducts = await Product.find({
      _id: {
        $in: res.store.products,
      },
    });
    console.log(storeProducts);
    res.status(200).json(storeProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting all products from a store for a gender and style
router.get(
  "/:storeId/gender/:gender/style/:style",
  getStore,
  async (req, res) => {
    try {
      let storeGenderQuery;
      if (req.params.style == "all") {
        storeGenderQuery = {
          store: res.store,
          gender: req.params.gender,
        };
      } else {
        storeGenderQuery = {
          store: res.store,
          gender: req.params.gender,
          style: req.params.style,
        };
      }
      const allStyles = await Product.find(storeGenderQuery);
      res.status(200).json(allStyles);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Getting all styles for a gender from a store
router.get("/:storeId/style/:gender", getStore, async (req, res) => {
  try {
    const storeGenderQuery = { gender: req.params.gender, store: res.store };
    const allStyles = await Product.distinct("style", storeGenderQuery);
    res.status(200).json(allStyles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Adding a store
router.post("/", async (req, res) => {
  try {
    const new_store = new Store({
      name: req.body.name,
      num_products: 0,
      store_image: req.body.store_image,
      products: [],
    });
    result = await new_store.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating store
router.patch("/:storeId", getStore, async (req, res) => {
  try {
    const target_store = res.store;
    if (req.body.name) target_store.name = req.body.name;
    if (req.body.store_image) target_store.store_image = req.body.store_image;
    await target_store.save();
    res.status(200).json({ message: "Store name updated." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Deleting a specific store
router.delete("/:storeId", getStore, async (req, res) => {
  try {
    const target_store = res.store;
    for (let i = 0; i < target_store.num_products; i++) {
      const target_product = Product.findById(target_store.products[i]);
      await target_product.remove();
    }
    await target_store.remove();
    res.status(200).json({ message: "Store removed from database." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware
async function getStore(req, res, next) {
  try {
    const target_store = await Store.findById(req.params.storeId);
    if (!target_store)
      return res.status(404).json({ message: "Cannot find store." });
    res.store = target_store;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
