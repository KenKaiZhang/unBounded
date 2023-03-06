import express from "express";
import nodemailer from "nodemailer";
import { Customer } from "../database.js";

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "unboundedsw@gmail.com",
    pass: process.env.GMAIL_PASS,
  },
});

router.post("/order/:orderId", async (req, res) => {
  const targetCustomer = await Customer.findById(req.body.customerId);
  const mailContent = {
    from: "unboundedsw@gmail.com",
    to: targetCustomer.email,
    subject: `Order ${req.params.orderId} Receipt`,
    text: "Thank you for shopping at unBounded.",
  };
  transporter.sendMail(mailContent, (err, success) => {
    if (err) {
      res.status(503).json({ message: err.message });
    } else {
      res.status(200).json({ message: "Email sent successfully." });
    }
  });
});

router.post("/partnerRequest", async (req, res) => {
  const mailContent = {
    from: req.body.email,
    to: "unboundedsw@gmail.com",
    subject: `${req.body.brand} (${req.body.id})partnership request`,
    text: req.body.message,
  };
  transporter.sendMail(mailContent, (err, success) => {
    if (err) {
      res.status(503).json({ message: err.message });
    } else {
      res.status(200).json("Email sent successfully.");
    }
  });
});

export default router;
