import { baseUrl, getCartId } from "./utils/init.js";
import { goToCheckout } from "./utils/goto.js";

const cartId = getCartId();
document.querySelector(".continue").addEventListener("click", () => {
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
    fetch(`${baseUrl}/carts/${cartId}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ownerName: userName.value,
        ownerEmail: userEmail.value,
      }),
    })
      .then((res) => res.json())
      .then(() => goToCheckout());
  }
});
