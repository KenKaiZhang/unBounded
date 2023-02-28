async function showAvailableCountries() {
  const productNavHTML = document.querySelector(".countries-filter");
  await fetch("http://localhost:1232/brands/options/countries", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((countries) => {
      countries.map((country) => {
        const newCountry = document.createElement("li");
        newCountry.innerText = country;
        newCountry.onclick = () => showBrands(country);
        productNavHTML.appendChild(newCountry);
      });
    });
}

/**
 * Shows brands by country selected
 */
async function showBrands(country = "everywhere") {
  const brandsHTML = document.querySelector(".brands");
  brandsHTML.innerHTML = "";
  const URL = `http://localhost:1232/brands/country/${country}`;
  await fetch(URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((brands) => {
      brands.map((brand) => {
        const newBrand = document.createElement("div");
        newBrand.id = brand._id;

        const brandNavigation = document.createElement("div");
        brandNavigation.classList.add("brand-navigation");
        brandNavigation.style.background = "#000000";

        const brandName = document.createElement("div");
        brandName.classList.add("name");
        const name = document.createElement("p");
        name.innerText = brand.name;
        brandName.appendChild(name);
        brandNavigation.appendChild(brandName);

        const navButtons = document.createElement("div");
        navButtons.classList.add("buttons");
        const menButton = document.createElement("button");
        menButton.classList.add("men");
        menButton.innerText = "MEN";
        menButton.onclick = () => goToBrand(brand._id, "Men");
        const womenButton = document.createElement("button");
        womenButton.classList.add("women");
        womenButton.innerText = "WOMEN";
        womenButton.onclick = () => goToBrand(brand._id, "Women");

        navButtons.appendChild(menButton);
        navButtons.appendChild(womenButton);

        brandNavigation.appendChild(navButtons);

        const brandText = document.createElement("div");
        brandText.classList.add("brand-text");
        brandText.innerText = brand.description;

        newBrand.appendChild(brandNavigation);
        newBrand.appendChild(brandText);
        brandsHTML.appendChild(newBrand);
      });
    });
}

/**
 * Shows the product information. Triggers upon clicking on a product listed in one of the
 * product listing HTML pages.
 */
async function showProductInformation() {
  const selectedProduct = window.localStorage.getItem("selectedProduct");

  const URL = `https://data.unboundedsw.com/products/${selectedProduct}`;
  await fetch(URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((product) => {
      const productImage = document.querySelector(".image");
      const image = document.createElement("img");
      image.src = product.image_url;
      productImage.appendChild(image);

      const productName = document.querySelector(".product-name");
      const name = document.createElement("h1");
      //name.innerHTML = `${product.name}<hr>`;
      name.innerHTML = "Bwankie is cute";
      productName.appendChild(name);

      const productPrice = document.querySelector(".product-price");
      const price = document.createElement("p");
      price.innerText = `$ ${product.price}`;
      productPrice.appendChild(price);
    });
}

/**
 * Show all products (filtered by gender).
 */
async function showProducts() {
  const brand = window.localStorage.getItem("brand");
  const gender = window.localStorage.getItem("gender");
  const style = window.localStorage.getItem("style");
  console.log(brand, gender, style);
  const active = document.getElementsByClassName("active")[0];
  if (active) active.classList.remove("active");
  document.querySelector(`.${gender}`).classList.add("active");
  const productsHTML = document.getElementsByClassName("products")[0];
  productsHTML.innerHTML = "";

  await fetch("http://localhost:1232/products/filter", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      brand: brand === null ? { $ne: null } : brand,
      gender: gender === null ? { $ne: null } : gender,
      style: style === null ? { $ne: null } : style,
    }),
  })
    .then((res) => res.json())
    .then((products) => {
      console.log(products);
      products.map((product) => {
        const newProduct = document.createElement("div");
        newProduct.classList.add("product");
        newProduct.id = product._id;
        newProduct.onclick = () => goToProduct(product._id);

        const productImage = document.createElement("div");
        productImage.classList.add("image");
        const image = document.createElement("img");
        // image.src = product.image_url;
        // image.alt = "product_img";
        const productImageBackdrop = document.createElement("div");
        productImageBackdrop.classList.add("backdrop");
        productImage.appendChild(image);
        productImage.appendChild(productImageBackdrop);

        const productInfo = document.createElement("div");
        productInfo.classList.add("info");
        const name = document.createElement("p");
        name.innerText = product.name;
        const price = document.createElement("p");
        price.innerText = `$${product.price}`;
        productInfo.appendChild(name);
        productInfo.appendChild(price);

        newProduct.appendChild(productImage);
        newProduct.appendChild(productInfo);
        productsHTML.appendChild(newProduct);
      });
    });
}

/**
 * Show everything in the cart.
 */
async function showCart() {
  const userId = document.cookie.split("userId=")[1];
  const itemsHTML = document.querySelector(".items");

  await fetch(`https://data.unboundedsw.com/customers/${userId}/cart`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((cart) => {
      const items = cart.items;
      const total = cart.total;

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

        await fetch(`https://data.unboundedsw.com/products/${item.product}`, {
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
            itemImage.src = product.image_url;
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

          changeCartQuantity(item._id, newQuantity).then((product_total) => {
            itemDiv.childNodes[2].innerText = `$ ${product_total}`;
            getCartTotal().then((cart) => {
              const cartTotal = document.querySelector("#subtotal");
              cartTotal.innerText = `$ ${cart.total}`;
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
            changeCartQuantity(item._id, 0).then((product_total) => {
              itemDiv.childNodes[2].innerText = `$ ${product_total}`;
              getCartTotal().then((cart) => {
                const cartTotal = document.querySelector("#subtotal");
                cartTotal.innerText = `$ ${cart.total}`;
              });
            });
            itemDiv.remove();
          } else {
            quantityDiv.childNodes[1].innerText = newQuantity;
            changeCartQuantity(item._id, newQuantity).then((product_total) => {
              itemDiv.childNodes[2].innerText = `$ ${product_total}`;
              getCartTotal().then((cart) => {
                const cartTotal = document.querySelector("#subtotal");
                cartTotal.innerText = `$ ${cart.total}`;
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

        itemTotal.innerText = `$ ${item.product_total}`;

        const cancelIcon = document.createElement("i");
        cancelIcon.classList.add("material-icons");
        cancelIcon.innerText = "close";
        itemCancel.appendChild(cancelIcon);
        itemCancel.onclick = () => {
          const itemDiv = document.getElementById(`${item._id}`);
          changeCartQuantity(item._id, 0).then(() => {
            getCartTotal().then((cart) => {
              const cartTotal = document.querySelector("#subtotal");
              cartTotal.innerText = `$ ${cart.total}`;
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
      cartTotal.innerText = `$${total}`;
    });
}

/**
 * Show state options
 */
function showStateOptions() {
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
}

/**
 * show billing address
 */
function showBillingAddress() {
  if (document.querySelector("#switch").checked) {
    document.querySelector(".billing-address").style.display = "none";
    document.querySelector(".content").style.height = "880px";
  } else {
    document.querySelector(".content").style.height = "990px";
    document.querySelector(".billing-address").style.display = null;
  }
}

/**
 * Show basic user information
 */
async function showBasicInformation() {
  const basicUserInfo = document.querySelector(".basic .user-info p");

  const userId = document.cookie.split("userId=")[1];
  await fetch(`https://data.unboundedsw.com/customers/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((user) => {
      basicUserInfo.innerText = `Full Name: ${user.name}\nEmail Address: ${user.email}`;
    });
}
