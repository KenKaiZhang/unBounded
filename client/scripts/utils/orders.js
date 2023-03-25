import { baseUrl, getCartId } from "./init.js";

const cartId = getCartId();

export async function createOrder(orderId) {
  let customerName;
  let targetCart;
  await fetch(`${baseUrl}/carts/${cartId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((cart) => {
      customerName = cart.ownerName;
    });
  await fetch(`${baseUrl}/carts/${cartId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((cart) => {
      targetCart = cart;
    });
  await fetch(`${baseUrl}/orders`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: customerName,
      orderId: orderId,
      total: targetCart.total,
      address: `${document.querySelector("#address").value}:${
        document.querySelector("#city").value
      }, ${document.querySelector("#state").value} ${
        document.querySelector("#zipcode").value
      }:United States`,
    }),
  });
}

export async function sendOrderEmail(orderId) {
  await fetch(`${baseUrl}/email/order`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cartId: cartId,
      orderId: orderId,
    }),
  });
}
