import express from "express";
import { Partner } from "../database.js";

const router = express.Router();

// Add partner to waitlist
router.post("/", async (req, res) => {
  try {
    const newPartner = new Partner({
      owner_name: req.body.ownerName,
      store_name: req.body.storeName,
      store_address: req.body.storeAddress,
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message,
    });
    await newPartner.save();
    res.status(201).json(newPartner._id);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
