import { baseUrl } from "./utils/init.js";
import { validateFieldsFilled } from "./utils/validate.js";

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
  let partnerId = "";
  fetch(`${baseUrl}/waitlist`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ownerName: values.ownerName,
      storeName: values.brandName,
      storeAddress: values.country,
      email: values.email,
      phone: values.phone,
      message: values.message,
    }),
  })
    .then((res) => res.json())
    .then(async (response) => {
      partnerId = response;
    });

  fetch(`${baseUrl}/email/partnerRequest`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: partnerId,
      email: values.email,
      brand: values.brandName,
      message: values.message,
    }),
  }).then((res) => {
    const msg = res.status == 200 ? "#success" : "#failed";
    console.log(msg);
    document.querySelector(".email-result").style.display = "block";
    document.querySelector(msg).style.display = "block";
    document.querySelector(".welcome-box").style.opacity = "10%";
  });
});

Array.from(document.querySelectorAll(".close")).map((closeDiv) => {
  closeDiv.addEventListener("click", () => {
    document.querySelector(".email-result").style.display = "none";
    document.querySelector("#success").style.display = "none";
    document.querySelector("#failed").style.display = "none";
    document.querySelector(".welcome-box").style.opacity = "100%";
  });
});
