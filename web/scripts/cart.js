async function addToCart(productId, quantity) {
  const userId = document.cookie.split("userId=")[1];
  fetch(`http://localhost:6969/users/${userId}/add_item`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product: productId,
      quantity: quantity,
    }),
  })
    .then((res) => res.json())
    .then((response) => console.log(response));
}

async function changeCartQuantity(itemId, quantity) {
  const userId = document.cookie.split("userId=")[1];
  return fetch(`http://localhost:6969/users/${userId}/change_item`, {
    method: "POST",
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
  const userId = document.cookie.split("userId=")[1];
  return fetch(`http://localhost:6969/users/${userId}/cart`, {
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
