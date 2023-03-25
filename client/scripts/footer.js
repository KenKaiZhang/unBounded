import { baseUrl } from "./utils/init.js";
import { goToLink } from "./utils/goto.js";

// Setting up links for navigating between the main pages
document.querySelector("#home").onclick = () => goToLink("/");
["store", "about", "join", "help"].map((page) => {
  document
    .querySelector(`#${page}`)
    .addEventListener("click", () => goToLink(`/${page}.html`));
});

// Setting up links to socials
["instagram", "facebook", "twitter"].map((social) => {
  document
    .querySelector(`#${social}`)
    .addEventListener("click", () =>
      goToLink(`https://www.${social}.com/unboundedsw/`)
    );
});

// Set up button
document
  .querySelector("#join-newsletter")
  .addEventListener("click", async () => {
    const email = document.querySelector("#email").value;
    await fetch(`${baseUrl}/email/newsletter`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    }).then((res) => {
      const button = document.querySelector("#join-newsletter");
      if (res.status == 200) {
        button.innerText = "JOINED!";
        button.style.borderColor = "#fffefb";
        button.disable;
      } else {
        button.style.borderColor = "#ff2626";
      }
    });
  });
