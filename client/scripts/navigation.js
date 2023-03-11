import { goToLink } from "./utils/goto.js";

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

/*
 *Settings for smaller screen size
 */

// Setting toggle to reveal main navigation
const toggle = document.querySelector(".toggle");
toggle.addEventListener("click", () => {
  const toggled = toggle.id === "active";
  toggle.id = toggled ? null : "active";
  const navbarHTML = document.querySelector(".navbar");
  if (toggled) {
    document.querySelector(".toggle i").style.transform = "rotate(180deg)";
    navbarHTML.style.display = "flex";
    navbarHTML.style.borderTop = "2px solid #3c3c3c";
    window.parent.document.querySelector("nav iframe").style.height = "120px";
  } else {
    document.querySelector(".toggle i").style.transform = "rotate(0deg)";
    navbarHTML.style.display = "none";
    navbarHTML.style.borderTop = "none";
    window.parent.document.querySelector("nav iframe").style.height = "80px";
  }
});
