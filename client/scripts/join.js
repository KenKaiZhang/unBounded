import { validateFieldsFilled } from "./utils/validate.js";
import { addToWaitlist } from "./utils/add.js";

// Set trigger for animation
document.querySelector(".join-button").addEventListener("click", () => {
  document.querySelector(".content").classList.add("shift");
});

// Set checking to see if send button is ready
const sendButton = document.querySelector("#send-message");
document.querySelector(".contact-form").addEventListener("keyup", () => {
  sendButton.disabled = !validateFieldsFilled(".field input");
});

// Set button action
sendButton.addEventListener("click", () => {
  const values = {
    ownerName: document.querySelector("#name").value,
    brandName: document.querySelector("#brand").value,
    country: document.querySelector("#country").value,
    email: document.querySelector("#email").value,
    phone: document.querySelector("#phone").value,
    message: document.querySelector("#message").value,
  };
  const results = addToWaitlist(values);
  const msg = results == 200 ? ".success" : ".failed";
  document.querySelector(".email-result").style.display = "block";
  document.querySelector(msg).style.display = "block";
  document.querySelector(".welcome-box").style.opacity = "10%";
});

Array.from(document.querySelectorAll(".close")).map((closeDiv) => {
  closeDiv.addEventListener("click", () => {
    document.querySelector(".email-result").style.display = "none";
    document.querySelector(".welcome-box").style.opacity = "100%";
  });
});
