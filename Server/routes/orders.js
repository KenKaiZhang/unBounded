const express = require("express");
const router = express.Router();
const Order = require("../models/order");

// Create a new order
router.post("/", async (req, res) => {
  try {
    const newOrder = new Order({
      userName: req.body.name,
      orderId: req.body.id,
      orderItems: req.body.items,
      orderTotal: req.body.total,
      orderDate: new Date(),
      orderAddress: req.body.address,
    });
    const result = await newOrder.save();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
