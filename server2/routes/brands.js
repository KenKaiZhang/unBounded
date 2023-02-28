import express from "express";
import { Brand } from "../database.js";

const router = express.Router();

// Get all the brands
router.get("/", async (req, res) => {
  try {
    const allBrands = await Brand.find();
    res.status(200).json(allBrands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get available countries
router.get("/countries", async (req, res) => {
  try {
    console.log("TRIGGER");
    const allCountries = await Brand.distinct("country");
    console.log(allCountries);
    res.status(200).json(allCountries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific brand
router.get("/:brandId", getBrand, async (req, res) => {
  try {
    const targetBrand = res.brand;
    res.status(200).json({ message: targetBrand });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new brand
router.post("/", async (req, res) => {
  try {
    const newBrand = new Brand({
      name: req.body.name,
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
      country: req.body.country,
      collections: req.body.collections,
      image: req.body.image,
      description: req.body.description,
    });
    await newBrand.save();
    res
      .status(200)
      .json({ message: "New brand successfully added to the site." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getBrand(req, res, next) {
  try {
    const targetBrand = await Brand.findById(req.params.brandId);
    if (!targetBrand)
      return res.status(404).json({ message: "Cannot find brand." });
    res.brand = targetBrand;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export default router;
