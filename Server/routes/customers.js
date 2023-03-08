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

// Make a new customer and assign a new cart
router.post("/", async (req, res) => {
  try {
    console.log("NEW CUSTOMER");
    const newCustomer = new Customer({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    });
    await newCustomer.save();
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

async function getCustomer(req, res, next) {
  try {
    const targetCustomer = await Customer.findById(req.params.customerId);
    if (!targetCustomer)
      return res.status(404).json({ message: "Cannot find customer." });
    res.customer = targetCustomer;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export default router;
