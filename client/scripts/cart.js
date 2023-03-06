const customer = document.cookie.split("userId=")[1];

async function addToCart(productId, quantity) {
  fetch(`${baseUrl}/customers/${customerId}/addItem`, {
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

async function changeCartQuantity(itemId, quantity) {
  return fetch(`${baseUrl}/customers/${customerId}/changeItem`, {
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

async function getCartTotal() {
  return fetch(`${baseUrl}/customers/${customerId}/cart`, {
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

async function clearCart() {
  fetch(`${baseUrl}/customers/${customerId}/newCart`, {
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

function cartButtonEvent() {
  const targetProduct = window.localStorage.getItem("product");
  document.querySelector(".add-to-cart").onclick = () =>
    addToCart(targetProduct, 1);
}
