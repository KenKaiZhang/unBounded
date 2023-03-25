import express from "express";
import ejs from "ejs";
import nodemailer from "nodemailer";
import { Product, Cart, Newsletter, Order } from "../database.js";

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

router.post("/order", async (req, res) => {
  const order = await Order.findOne({ orderId: req.body.orderId });
  const targetCart = await Cart.findById(req.body.cartId);

  const orderId = order.orderId;
  const address = order.orderAddress.split(":");
  const subtotal = targetCart.subtotal;
  const items = await Promise.all(
    targetCart.items.map(async (item) => {
      const targetProduct = await Product.findById(item.product);
      return {
        productName: targetProduct.name,
        quantity: item.quantity,
        productTotal: item.productTotal,
      };
    })
  );
  ejs.renderFile(
    "email_templates/receipt.ejs",
    { orderId, address, items, subtotal },
    (err, html) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
      } else {
        const mailContent = {
          from: "unboundedsw@gmail.com",
          to: targetCart.ownerEmail,
          subject: `Order ${orderId} Receipt`,
          html: html,
        };
        transporter.sendMail(mailContent, (err, success) => {
          if (err) {
            console.log(err);
            res.status(503).json({ message: err.message });
          } else {
            res.status(200).json({ message: "Email sent successfully." });
          }
        });
      }
    }
  );
});

router.post("/partnerRequest", checkEmailValid, (req, res) => {
  const mailContent = {
    from: res.email,
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

router.post("/newsletter", checkEmailValid, async (req, res) => {
  try {
    const newEmail = new Newsletter({
      email: res.email,
    });
    await newEmail.save();
    res.status(200).json("Email added to newsletter.");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

function checkEmailValid(req, res, next) {
  try {
    const customerEmail = req.body.email;
    if (
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(customerEmail) ==
      false
    ) {
      return res.status(400).json("Bad email format.");
    }
    res.email = customerEmail;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export default router;
