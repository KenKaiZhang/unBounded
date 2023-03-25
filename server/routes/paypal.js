import express from "express";
import fetch from "node-fetch";
import * as dotenv from "dotenv";
import { Customer, Cart, Product } from "../database.js";

dotenv.config();
const router = express.Router();
const base = "https://api-m.sandbox.paypal.com";

// render checkout page with client id & unique client token
router.get("/createClient", async (req, res) => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  try {
    const clientToken = await generateClientToken();
    res.status(200).json({ clientId, clientToken });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// create order
router.post("/orders/createOrder", getCart, async (req, res) => {
  try {
    const order = await createOrder(res.cart);
    res.json(order);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// capture payment
router.post("/orders/:orderID/capture", async (req, res) => {
  const { orderID } = req.params;
  try {
    const captureData = await capturePayment(orderID);
    res.json(captureData);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// call the create order method
async function createOrder(cart) {
  const purchaseAmount = cart.subtotal; // TODO: pull prices from a database
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: purchaseAmount,
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: purchaseAmount,
              },
            },
          },
        },
      ],
      items: cart.items.map((item) => {
        createItem(item);
      }),
    }),
  });

  return handleResponse(response);
}

// capture payment for an order
async function capturePayment(orderId) {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderId}/capture`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
}

// // generate access token
async function generateAccessToken() {
  const auth = Buffer.from(
    process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_CLIENT_SECRET
  ).toString("base64");
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  const jsonData = await handleResponse(response);
  return jsonData.access_token;
}

// generate client token
async function generateClientToken() {
  const accessToken = await generateAccessToken();
  const response = await fetch(`${base}/v1/identity/generate-token`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Accept-Language": "en_US",
      "Content-Type": "application/json",
    },
  });
  const jsonData = await handleResponse(response);
  return jsonData.client_token;
}

async function handleResponse(response) {
  if (response.status === 200 || response.status === 201) {
    return response.json();
  }

  const errorMessage = await response.text();
  throw new Error(errorMessage);
}

async function getCart(req, res, next) {
  try {
    const targetCart = await Cart.findById(req.body.cartId);
    if (!targetCart)
      return res
        .status(404)
        .json({ message: "Cannot find cart with associate id." });
    res.cart = targetCart;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function createItem(itemInCart) {
  const itemProduct = await Product.findById(itemInCart.product);
  const item = {
    name: itemProduct.name,
    unit_amount: {
      currency_code: "USD",
      value: itemProduct.price,
    },
    quantity: itemInCart.quantity,
  };
  return item;
}

export default router;
