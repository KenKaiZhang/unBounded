import { baseUrl, getCartId } from "./init.js";
/**
 * This is all the location manipulation scripts. goTo followed by the word changes
 * the webpage to displace the named HTML. Used localStorage to save data from one
 * HTML to another.
 */

const cartId = getCartId();

export function makeRequest(request) {
  window.localStorage.setItem("request", JSON.stringify(request));
}

export function goToStore() {
  window.location.href = "/store.html";
}

export function goToBrand(brandId, gender) {
  makeRequest({ brand: brandId, gender: gender });
  window.location.href = `/brand.html`;
}

export function goToProducts(gender) {
  makeRequest({ gender: gender });
  window.location.href = "/products.html";
}

export function goToProduct(productId) {
  window.localStorage.setItem("product", productId);
  window.location.href = "/product.html";
}

export function goToBrandOrProducts() {
  const request = JSON.parse(window.localStorage.getItem("request"));
  if (request.brand === undefined) {
    window.location.href = "/products.html";
  } else if (request.brand === "home") {
    window.location.href = "/store.html";
  } else {
    window.location.href = "/brand.html";
  }
}

export async function goToRegister() {
  await fetch(`${baseUrl}/carts/${cartId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((cart) => {
      if (cart.ownerName !== undefined && cart.ownerEmail !== undefined) {
        window.location.href = "/checkout.html";
      } else {
        window.location.href = "/register.html";
      }
    });
}

export async function skipToRegister() {
  makeRequest({ brand: "home" });
  await fetch(`${baseUrl}/carts/${cartId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((cart) => {
      if (cart.ownerName !== undefined && cart.ownerEmail !== undefined) {
        window.parent.location.href = "/checkout.html";
      } else {
        window.parent.location.href = "/register.html";
      }
    });
}

export function goToCheckout() {
  window.location.href = "/checkout.html";
}

export function goToLink(link) {
  window.parent.location.href = link;
}
