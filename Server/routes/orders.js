import express from "express";
import { Cart, Order } from "../database.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const newOrder = new Order({
      customerName: req.body.customerName,
      customerCart: req.body.customerCart,
      orderId: req.body.orderId,
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

export default router;
