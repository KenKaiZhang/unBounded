import express from "express";
import { Brand, Product } from "../database.js";

const router = express.Router();

// Get ALL the products
router.get("/", async (req, res) => {
  try {
    const allProducts = await Product.find();
    res.status(200).json({ message: allProducts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific product
router.get("/:productId", getProduct, async (req, res) => {
  try {
    const targetProduct = res.product;
    res.status(200).json({ message: targetProduct });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get products accepted by filter
router.get("/filter", async (req, res) => {
  try {
    const targetProducts = await Product.find(req.body);
    res.status(200).json({ message: targetProducts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get the different styles
router.get("/styles", async (req, res) => {
  try {
    const allStyles = await Product.distinct("style", req.body);
    res.status(200).json({ message: allStyles });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new product
router.post("/", async (req, res) => {
  try {
    const newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      brand: await Brand.findById(req.body.brandId),
      col: req.body.col,
      image: req.body.image,
      style: req.body.style,
      gender: req.body.gender,
      discription: req.body.description,
    });
    await newProduct.save();
    res.status(201).json({ message: "New product successfully created." });
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

export default router;