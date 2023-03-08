import { goToStore, goToRegister } from "./utils/goto.js";
import { toggleSideFilter } from "./utils/filter.js";

// Set navigation back to store page
document
  .querySelector(".unBounded")
  .addEventListener("click", () => goToStore());

// Set navigation to register page
document.querySelector(".cart").addEventListener("click", () => goToRegister());

// Set side filter toggle
document
  .querySelector("#menu")
  .addEventListener("click", () => toggleSideFilter());
