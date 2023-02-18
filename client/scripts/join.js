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
      message: message,
    }),
  }).then((res) => {
    if (res.status == 200) {
      document.querySelector(".content").classList.add("success");
    }
  });
  console.log("SENT");
}

function activateSendMessage(formId) {
  const sendButton = document.querySelector("#send-message");
  sendButton.disabled = !validateFieldsFilled(formId);
}
