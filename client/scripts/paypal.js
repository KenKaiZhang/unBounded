function showProcessResults(result = true) {
  document.querySelector(".results").style.display = "flex";
  const processHTML = document.querySelector(
    result ? ".accepted" : ".declined"
  );
  processHTML.style.display = "flex";
  processHTML.style.opacity = "100%";
}

paypal
  .Buttons({
    // Sets up the transaction when a payment button is clicked
    onInit: (data, actions) => {
      actions.disable();
      document.querySelector("#shipping-form").addEventListener("keyup", () => {
        if (validateFieldsFilled("#shipping-form .field-input")) {
          actions.enable();
        } else {
          actions.disable();
        }
      });
    },

    createOrder: () => {
      return fetch(`${baseUrl}/paypal/orders/createOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: customerId,
        }),
      })
        .then((response) => response.json())
        .then((order) => order.id);
    },
    onApprove: (data, actions) => {
      return fetch(`${baseUrl}/paypal/orders/${data.orderID}/capture`, {
        method: "POST",
      })
        .then((response) => response.json())
        .then(() => {
          createOrder(data.orderID)
            .then(() => showProcessResults())
            .then(() => {
              sendOrderEmail(data.orderID).then(clearCart());
            });
        });
    },
  })
  .render("#paypal-button");

if (paypal.HostedFields.isEligible()) {
  let orderId;
  paypal.HostedFields.render({
    createOrder: () => {
      return fetch(`${baseUrl}/paypal/orders/createOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: customerId,
        }),
      })
        .then((res) => res.json())
        .then((orderData) => {
          orderId = orderData.id;
          return orderData.id;
        });
    },
    styles: {
      ".valid": {
        color: "#000000",
      },
      ".invalid": {
        color: "red",
      },
    },
    fields: {
      number: {
        selector: "#card-number",
      },
      cvv: {
        selector: "#cvv",
      },
      expirationDate: {
        selector: "#expiration",
      },
    },
  }).then((cardFields) => {
    document.querySelector("#card-form").addEventListener("submit", (event) => {
      const switched = !document.querySelector("#switch").checked;
      event.preventDefault();
      cardFields
        .submit({
          cardholderName: `${document.getElementById("card-firstname").value} ${
            document.getElementById("card-lastname").value
          }`,
          billingAddress: {
            streetAddress: switched
              ? document.getElementById("billing-address").value
              : document.getElementById("address").value,
            region: switched
              ? document.getElementById("billing-state").value
              : document.getElementById("state").value,
            locality: switched
              ? document.getElementById("billing-city").value
              : document.getElementById("city").value,
            postalCode: switched
              ? document.getElementById("billing-zipcode").value
              : document.getElementById("zipcode").value,
            countryCodeAlpha2: "US",
          },
        })
        .then(() => {
          fetch(`${baseUrl}/paypal/orders/${orderId}/capture`, {
            method: "POST",
          })
            .then((res) => res.json())
            .then((orderData) => {
              const errorDetail =
                Array.isArray(orderData.details) && orderData.details[0];
              if (errorDetail) {
                var msg = "Sorry, your transaction could not be processed.";
                if (errorDetail.description)
                  msg += "\n\n" + errorDetail.description;
                if (orderData.debug_id) msg += " (" + orderData.debug_id + ")";
                return alert(msg); // Show a failure message
              }
              createOrder(orderId)
                .then(() => showProcessResults())
                .then(() => {
                  sendOrderEmail(orderId).then(clearCart());
                });
            });
        })
        .catch((err) => {
          showProcessResults(false);
        });
    });
  });
}
