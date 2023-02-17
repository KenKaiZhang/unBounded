const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "unboundedsw@gmail.com",
    pass: process.env.GMAIL_PASS,
  },
});

router.post("/:orderId", async (req, res) => {
  const mailContent = {
    from: "unboundedsw@gmail.com",
    to: "ken.cyc@gmail.com",
    subject: `Order ${req.params.orderId} Receipt`,
    text: "Thank you for shopping at unBounded.",
  };
  transporter.sendMail(mailContent, (err, success) => {
    if (err) {
      console.log(err);
    } else {
      console.log(success);
    }
  });
});

module.exports = router;
