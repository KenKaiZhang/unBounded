import { addToCart } from "./utils/cart.js";
import { goToBrandOrProducts, goToRegister } from "./utils/goto.js";
import { showBrandName, showProductInformation } from "./utils/show.js";

// Set button to go back to shopping
document
  .querySelector(".unBounded")
  .addEventListener("click", () => goToBrandOrProducts());

// Set button to go to register
document.querySelector(".cart").addEventListener("click", () => goToRegister());

// Add item to the cart
const targetProduct = window.localStorage.getItem("product");
document
  .querySelector(".add-to-cart")
  .addEventListener("click", () => addToCart(targetProduct, 1));

showBrandName(".unBounded p");
showProductInformation();
