const user = document.cookie.split("userId=")[1];
async function addToCart(productId, quantity) {
  fetch(`https://data.unboundedsw.com/customers/${user}/add_item`, {
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
  return fetch(`https://data.unboundedsw.com/customers/${user}/change_item`, {
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
  return fetch(`https://data.unboundedsw.com/customers/${user}/cart`, {
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
