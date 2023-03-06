/**
 * This is all the location manipulation scripts. goTo followed by the word changes
 * the webpage to displace the named HTML. Used localStorage to save data from one
 * HTML to another.
 */

function makeRequest(request) {
  window.localStorage.setItem("request", JSON.stringify(request));
}

function returnToStore() {
  window.location.href = "/store.html";
}

function goToBrand(brandId, gender) {
  makeRequest({ brand: brandId, gender: gender });
  window.location.href = `/brand.html`;
}

function goToProducts(gender) {
  makeRequest({ gender: gender });
  window.location.href = "/products.html";
}

function goToProduct(productId) {
  window.localStorage.setItem("product", productId);
  window.location.href = "/product.html";
}

function goToBrandOrProducts() {
  const request = JSON.parse(window.localStorage.getItem("request"));
  window.location.href =
    request.brand === undefined
      ? (window.location.href = "/products.html")
      : (window.location.href = "/brand.html");
}

async function goToRegister() {
  await fetch(`${baseUrl}/customers/${customerId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((customer) => {
      if (customer.name !== undefined && customer.email !== undefined) {
        window.location.href = "/checkout.html";
      } else {
        window.location.href = "/register.html";
      }
    });
}

async function continueToCheckout() {
  const userName = document.querySelector("#user-name");
  const userEmail = document.querySelector("#user-email");

  if (userName.value == "" || userEmail.value == "") {
    if (userName.value == "") {
      userName.style.borderBottom = "2px solid #FF8E76";
    }
    if (userEmail.value == "") {
      userEmail.style.borderBottom = "2px solid #FF8E76";
    }
  } else {
    await fetch(`${baseUrl}/customers/${customerId}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userName.value,
        email: userEmail.value,
      }),
    })
      .then((res) => res.json())
      .then((res) => goToCheckout());
  }
}

function goToCheckout() {
  window.location.href = "/checkout.html";
}

function goToLink(link) {
  window.parent.location.href = link;
}
