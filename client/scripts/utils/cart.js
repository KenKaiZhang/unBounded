import { baseUrl, getCartId } from "./init.js";

const cartId = getCartId();

export async function addToCart(productId, quantity) {
  fetch(`${baseUrl}/carts/${cartId}/addItem`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product: productId,
      quantity: quantity,
    }),
  });
}

export async function changeCartQuantity(itemId, quantity) {
  return fetch(`${baseUrl}/carts/${cartId}/changeItem`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      itemId: itemId,
      quantity: quantity,
    }),
  })
    .then((res) => res.json())
    .then((response) => {
      return response;
    });
}

export async function getCartTotal() {
  return fetch(`${baseUrl}/carts/${cartId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((cart) => {
      return cart;
    });
}

export async function clearCart() {
  fetch(`${baseUrl}/carts/${cartId}/newCart`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      document.querySelector("#subtotal").innerText = `$${res.subtotal}`;
      document.querySelector(".items").innerHTML = "";
    });
}
