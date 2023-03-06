async function addToWaitlist() {
  const ownerName = document.querySelector("#name").value;
  const brandName = document.querySelector("#brand").value;
  const country = document.querySelector("#country").value;
  const email = document.querySelector("#email").value;
  const phone = document.querySelector("#phone").value;
  const message = document.querySelector("#message").value;

  let partnerId = "";
  await fetch("https://data.unboundedsw.com/waitlist", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ownerName: ownerName,
      storeName: brandName,
      storeAddress: country,
      email: email,
      phone: phone,
      message: message,
    }),
  })
    .then((res) => res.json())
    .then(async (response) => {
      partnerId = response;
    });

  await fetch("https://data.unboundedsw.com/email/partner_request", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: partnerId,
      email: email,
      brand: brandName,
      message: message,
    }),
  }).then((res) => {
    const msg = res.status == 200 ? ".success" : ".failed";
    document.querySelector(".email-result").style.display = "block";
    document.querySelector(msg).style.display = "block";
    document.querySelector(".welcome-box").style.opacity = "10%";
  });
  console.log("SENT");
}

function activateSendMessage(formId) {
  const sendButton = document.querySelector("#send-message");
  sendButton.disabled = !validateFieldsFilled(formId);
}

function closeEmailResults() {
  document.querySelector(".email-result").style.display = "none";
  document.querySelector(".welcome-box").style.opacity = "100%";
}
