import { goToLink } from "./utils/goto.js";
import { addToNewsletter } from "./utils/add.js";

// Setting up links for navigating between the main pages
document.querySelector("#home").onclick = () => goToLink("/");
["store", "about", "join", "help"].map((page) => {
  document.querySelector(`#${page}`).onclick = () => goToLink(`/${page}.html`);
});

// Setting up links to socials
["instagram", "facebook", "twitter"].map((social) => {
  document.querySelector(`#${social}`).onclick = () =>
    goToLink(`https://www.${social}.com/unboundedsw/`);
});

// Set up button
document.querySelector("#join-newsletter").onclick = () => {
  const email = document.querySelector("#email").value;
  addToNewsletter(email);
};
