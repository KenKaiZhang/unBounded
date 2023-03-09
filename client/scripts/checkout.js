import { baseUrl, cartId } from "./utils/init.js";
import { goToBrandOrProducts } from "./utils/goto.js";
import { showBrandName } from "./utils/show.js";
import { changeCartQuantity, getCartTotal } from "./utils/cart.js";
import { validateFieldsFilled } from "./utils/validate.js";

function enableSubmit() {
  let enable;
  if (document.querySelectorAll(".item").length < 1) {
    enable = false;
  } else {
    enable = validateFieldsFilled("#shipping-form .field-input");
    if (enable) {
      const cardInputs = document.querySelectorAll("#card-form .field-input");
      const depth = document.querySelector("#switch").checked ? 4 : 0;
      for (let i = 0; i < cardInputs.length - depth; i++) {
        if (cardInputs[i].value == "") {
          document.querySelector("#submit").disabled = true;
          return;
        }
      }
    }
  }
  document.querySelector("#submit").disabled = !enable;
}

// Set link for paypal
const head = document.querySelector("head");
const clientScript = document.createElement("script");
await fetch(`${baseUrl}/paypal/createClient`, {
  method: "GET",
  headers: {
    Accept: "application/json",
  },
})
  .then((res) => res.json())
  .then((client) => {
    clientScript.src = `https://www.paypal.com/sdk/js?components=buttons,hosted-fields&client-id=${client.clientId}&disable-funding=credit`;
    clientScript.setAttribute("data-client-token", client.clientToken);
    clientScript.onload = () => {
      const paypalScript = document.createElement("script");
      paypalScript.type = "module";
      paypalScript.src = "scripts/paypal.js";
      head.appendChild(paypalScript);
    };
  });

head.appendChild(clientScript);

// Set button text to show shopping location
showBrandName(".unBounded p");

// Set button to return back to shopping
document
  .querySelector(".unBounded")
  .addEventListener("click", () => goToBrandOrProducts());

// Show contents of customer cart
const itemsHTML = document.querySelector(".items");
itemsHTML.addEventListener("click", () => {
  enableSubmit();
});
fetch(`${baseUrl}/carts/${cartId}`, {
  method: "GET",
  headers: {
    Accept: "application/json",
  },
})
  .then((res) => res.json())
  .then((cart) => {
    const items = cart.items;

    items.map(async (item) => {
      const newItemRow = document.createElement("div");
      newItemRow.classList.add("item");
      newItemRow.id = item._id;
      const itemSummary = document.createElement("div");
      itemSummary.classList.add("item-info");
      const itemQuantity = document.createElement("div");
      itemQuantity.classList.add("item-quantity");
      const itemTotal = document.createElement("div");
      itemTotal.classList.add("item-price");
      const itemCancel = document.createElement("div");
      itemCancel.classList.add("cancel");

      await fetch(`${baseUrl}/products/${item.product}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((product) => {
          const imageWrapper = document.createElement("div");
          imageWrapper.classList.add("image");
          const itemImage = document.createElement("img");
          // itemImage.src = product.image_url;
          itemImage.alt = "Product Image";
          imageWrapper.appendChild(itemImage);

          const itemInfo = document.createElement("div");
          itemInfo.classList.add("info");
          const itemName = document.createElement("p");
          itemName.innerText = product.name;

          itemInfo.appendChild(itemName);

          itemSummary.appendChild(imageWrapper);
          itemSummary.appendChild(itemInfo);
        });

      const incrementIconWrapper = document.createElement("div");
      incrementIconWrapper.classList.add("increment");
      incrementIconWrapper.onclick = () => {
        const itemDiv = document.getElementById(`${item._id}`);
        const quantityDiv = itemDiv.childNodes[1];
        const newQuantity = Number(quantityDiv.childNodes[1].innerText) + 1;
        quantityDiv.childNodes[1].innerText = newQuantity;
        changeCartQuantity(item._id, newQuantity).then((res) => {
          itemDiv.childNodes[2].innerText = `$ ${res.productTotal}`;
          getCartTotal().then((cart) => {
            const cartTotal = document.querySelector("#subtotal");
            cartTotal.innerText = `$ ${cart.subtotal}`;
          });
        });
      };
      const incrementIcon = document.createElement("i");
      incrementIcon.classList.add("material-icons");
      incrementIcon.innerText = "add";
      incrementIconWrapper.appendChild(incrementIcon);

      const decrementIconWrapper = document.createElement("div");
      decrementIconWrapper.classList.add("decrement");
      decrementIconWrapper.onclick = () => {
        const itemDiv = document.getElementById(`${item._id}`);
        const quantityDiv = itemDiv.childNodes[1];
        const newQuantity = Number(quantityDiv.childNodes[1].innerText) - 1;
        if (newQuantity <= 0) {
          changeCartQuantity(item._id, 0).then((res) => {
            itemDiv.childNodes[2].innerText = `$ ${res.productTotal}`;
            getCartTotal().then((cart) => {
              const cartTotal = document.querySelector("#subtotal");
              cartTotal.innerText = `$ ${cart.subtotal}`;
            });
          });
          itemDiv.remove();
        } else {
          quantityDiv.childNodes[1].innerText = newQuantity;
          changeCartQuantity(item._id, newQuantity).then((res) => {
            itemDiv.childNodes[2].innerText = `$ ${res.productTotal}`;
            getCartTotal().then((cart) => {
              const cartTotal = document.querySelector("#subtotal");
              cartTotal.innerText = `$ ${cart.subtotal}`;
            });
          });
        }
      };
      const decrementIcon = document.createElement("i");
      decrementIcon.classList.add("material-icons");
      decrementIcon.innerText = "remove";
      decrementIconWrapper.appendChild(decrementIcon);

      const quantityWrapper = document.createElement("div");
      quantityWrapper.classList.add("quantity");
      const quantity = document.createElement("p");
      quantity.innerText = item.quantity;
      quantityWrapper.appendChild(quantity);

      itemQuantity.appendChild(decrementIconWrapper);
      itemQuantity.appendChild(quantityWrapper);
      itemQuantity.appendChild(incrementIconWrapper);

      itemTotal.innerText = `$ ${item.productTotal}`;

      const cancelIcon = document.createElement("i");
      cancelIcon.classList.add("material-icons");
      cancelIcon.innerText = "close";
      itemCancel.appendChild(cancelIcon);
      itemCancel.onclick = () => {
        const itemDiv = document.getElementById(`${item._id}`);
        changeCartQuantity(item._id, 0).then(() => {
          getCartTotal().then((cart) => {
            const cartTotal = document.querySelector("#subtotal");
            cartTotal.innerText = `$ ${cart.subtotal}`;
          });
        });
        itemDiv.remove();
      };

      newItemRow.appendChild(itemSummary);
      newItemRow.appendChild(itemQuantity);
      newItemRow.appendChild(itemTotal);
      newItemRow.appendChild(itemCancel);
      itemsHTML.appendChild(newItemRow);
    });

    const cartTotal = document.querySelector("#subtotal");
    cartTotal.innerText = `$${cart.subtotal}`;
  });

// Show information from registration
const basicUserInfo = document.querySelector(".basic-info .user-info p");

fetch(`${baseUrl}/carts/${cartId}`, {
  method: "GET",
  headers: {
    Accept: "application/json",
  },
})
  .then((res) => res.json())
  .then((cart) => {
    basicUserInfo.innerText = `Full Name: ${cart.ownerName}\nEmail Address: ${cart.ownerEmail}`;
  });

// Set toggle for closing result box
Array.from(document.querySelectorAll(".close-button")).map((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".results").style.display = "none";
    document.querySelector(".accepted").style.display = "none";
    document.querySelector(".declined").style.display = "none";
  });
});

// Show state options
const usStates = [
  { name: "ALABAMA", abbreviation: "AL" },
  { name: "ALASKA", abbreviation: "AK" },
  { name: "AMERICAN SAMOA", abbreviation: "AS" },
  { name: "ARIZONA", abbreviation: "AZ" },
  { name: "ARKANSAS", abbreviation: "AR" },
  { name: "CALIFORNIA", abbreviation: "CA" },
  { name: "COLORADO", abbreviation: "CO" },
  { name: "CONNECTICUT", abbreviation: "CT" },
  { name: "DELAWARE", abbreviation: "DE" },
  { name: "DISTRICT OF COLUMBIA", abbreviation: "DC" },
  { name: "FEDERATED STATES OF MICRONESIA", abbreviation: "FM" },
  { name: "FLORIDA", abbreviation: "FL" },
  { name: "GEORGIA", abbreviation: "GA" },
  { name: "GUAM", abbreviation: "GU" },
  { name: "HAWAII", abbreviation: "HI" },
  { name: "IDAHO", abbreviation: "ID" },
  { name: "ILLINOIS", abbreviation: "IL" },
  { name: "INDIANA", abbreviation: "IN" },
  { name: "IOWA", abbreviation: "IA" },
  { name: "KANSAS", abbreviation: "KS" },
  { name: "KENTUCKY", abbreviation: "KY" },
  { name: "LOUISIANA", abbreviation: "LA" },
  { name: "MAINE", abbreviation: "ME" },
  { name: "MARSHALL ISLANDS", abbreviation: "MH" },
  { name: "MARYLAND", abbreviation: "MD" },
  { name: "MASSACHUSETTS", abbreviation: "MA" },
  { name: "MICHIGAN", abbreviation: "MI" },
  { name: "MINNESOTA", abbreviation: "MN" },
  { name: "MISSISSIPPI", abbreviation: "MS" },
  { name: "MISSOURI", abbreviation: "MO" },
  { name: "MONTANA", abbreviation: "MT" },
  { name: "NEBRASKA", abbreviation: "NE" },
  { name: "NEVADA", abbreviation: "NV" },
  { name: "NEW HAMPSHIRE", abbreviation: "NH" },
  { name: "NEW JERSEY", abbreviation: "NJ" },
  { name: "NEW MEXICO", abbreviation: "NM" },
  { name: "NEW YORK", abbreviation: "NY" },
  { name: "NORTH CAROLINA", abbreviation: "NC" },
  { name: "NORTH DAKOTA", abbreviation: "ND" },
  { name: "NORTHERN MARIANA ISLANDS", abbreviation: "MP" },
  { name: "OHIO", abbreviation: "OH" },
  { name: "OKLAHOMA", abbreviation: "OK" },
  { name: "OREGON", abbreviation: "OR" },
  { name: "PALAU", abbreviation: "PW" },
  { name: "PENNSYLVANIA", abbreviation: "PA" },
  { name: "PUERTO RICO", abbreviation: "PR" },
  { name: "RHODE ISLAND", abbreviation: "RI" },
  { name: "SOUTH CAROLINA", abbreviation: "SC" },
  { name: "SOUTH DAKOTA", abbreviation: "SD" },
  { name: "TENNESSEE", abbreviation: "TN" },
  { name: "TEXAS", abbreviation: "TX" },
  { name: "UTAH", abbreviation: "UT" },
  { name: "VERMONT", abbreviation: "VT" },
  { name: "VIRGIN ISLANDS", abbreviation: "VI" },
  { name: "VIRGINIA", abbreviation: "VA" },
  { name: "WASHINGTON", abbreviation: "WA" },
  { name: "WEST VIRGINIA", abbreviation: "WV" },
  { name: "WISCONSIN", abbreviation: "WI" },
  { name: "WYOMING", abbreviation: "WY" },
];
const stateOptions = document.querySelectorAll(".state");
usStates.map((state) => {
  for (let i = 0; i < stateOptions.length; i++) {
    const newOption = document.createElement("option");
    newOption.value = state.name;
    newOption.innerText = state.abbreviation;
    stateOptions[i].appendChild(newOption);
  }
});

// Set billing address toggle
const bagHTML = document.querySelector(".bag");
const iapHTML = document.querySelector(".info-address-payment");
bagHTML.style.height = iapHTML.style.height;
document.querySelector("#switch").addEventListener("click", () => {
  if (document.querySelector("#switch").checked) {
    document.querySelector(".billing-address").style.display = "none";
  } else {
    document.querySelector(".billing-address").style.display = "flex";
  }
  bagHTML.style.height = iapHTML.style.height;
  enableSubmit();
});

// Enable the submit button
Array.from(document.querySelectorAll(".form")).map((form) => {
  form.addEventListener("keyup", () => enableSubmit());
});
Array.from(document.querySelectorAll(".state")).map((option) => {
  option.addEventListener("change", () => enableSubmit());
});
