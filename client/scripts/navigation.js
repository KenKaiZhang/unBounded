import { goToLink, skipToRegister } from "./utils/goto.js";

// Setting up page links for navigating between the four main pages
document.querySelector("#company-name").onclick = () => goToLink("/");

["store", "about", "join", "help"].map((page) => {
  document.querySelector(`#${page}`).onclick = () =>
    goToLink(`/${page}.html`, page);
});

// Setting up which one will be active
const url = window.parent.location.href.split("/");
const page = url[url.length - 1].replace(".html", "");
document.querySelector(`.navbar #${page}`).classList.add("active");

// Set navigation to register page
document
  .querySelector("#cart")
  .addEventListener("click", async () => skipToRegister());
