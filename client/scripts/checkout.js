async function setClient() {
  const head = document.querySelector("head");
  const clientScript = document.createElement("script");
  await fetch(`${baseUrl}/paypal/createClient`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((client) => {
      clientScript.src = `https://www.paypal.com/sdk/js?components=buttons,hosted-fields&client-id=${client.clientId}&disable-funding=credit`;
      clientScript.setAttribute("data-client-token", client.clientToken);
      clientScript.onload = () => {
        const paypalScript = document.createElement("script");
        paypalScript.src = "scripts/paypal.js";
        head.appendChild(paypalScript);
      };
    });

  head.appendChild(clientScript);
}

async function createOrder(orderId) {
  let userName;
  let userCart;
  await fetch(`${baseUrl}/customers/${customerId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((user) => {
      userName = user.name;
    });
  await fetch(`${baseUrl}/customers/${customerId}/cart`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((cart) => {
      userCart = cart;
    });
  await fetch(`${baseUrl}/orders`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: userName,
      id: orderId,
      items: userCart.items,
      total: userCart.total,
      address: `${document.querySelector("#address").value}, ${
        document.querySelector("#city").value
      }, ${document.querySelector("#state").value}, US, ${
        document.querySelector("#zipcode").value
      }`,
    }),
  })
    .then((res) => res.json())
    .then((res) => console.log(res));
}

async function sendOrderEmail(orderId) {
  await fetch(`${baseUrl}/email/${orderId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: customerId,
    }),
  });
}

function enableSubmit() {
  const enable = validateFieldsFilled("#shipping-form .field-input");
  if (enable) {
    const cardInputs = document.querySelectorAll("#card-form .field-input");
    const depth = document.querySelector("#switch").checked ? 4 : 0;
    for (let i = 0; i < cardInputs.length - depth; i++) {
      if (cardInputs[i].value == "") {
        document.querySelector("#submit").disabled = true;
        return;
      }
    }
  }
  document.querySelector("#submit").disabled = !enable;
}

function closeResults() {
  document.querySelector(".results").style.display = "none";
  document.querySelector(".accepted").style.display = "none";
  document.querySelector(".declined").style.display = "none";
}

setClient();
