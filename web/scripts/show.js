/**
 * Shows all the collection available in the database.
 */

async function showCollections() {
  const collectionsHTML = document.getElementsByClassName("collections")[0];
  collectionsHTML.innerHTML = "";

  const URL = "http://localhost:6969/stores";
  await fetch(URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((collections) => {
      collections.map((collection, index) => {
        const newCollection = document.createElement("div");
        newCollection.classList.add("collection");
        newCollection.id = collection._id;

        const collectionNav = document.createElement("div");
        collectionNav.classList.add("nav");
        collectionNav.style.backgroundImage = `url(${collection.store_image})`;

        const collectionName = document.createElement("div");
        collectionName.classList.add("name");
        const name = document.createElement("p");
        name.innerText = collection.name;
        collectionName.appendChild(name);

        const navButtons = document.createElement("div");
        navButtons.classList.add("buttons");
        const menButton = document.createElement("button");
        menButton.classList.add("men");
        menButton.innerText = "MEN";
        menButton.onclick = () => goToCollection(collection._id, "male", "all");
        const womenButton = document.createElement("button");
        womenButton.classList.add("women");
        womenButton.innerText = "WOMEN";
        womenButton.onclick = () =>
          goToCollection(collection._id, "female", "all");
        navButtons.appendChild(menButton);
        navButtons.appendChild(womenButton);

        collectionNav.appendChild(collectionName);
        collectionNav.appendChild(navButtons);

        const collectionDescription = document.createElement("div");
        collectionDescription.classList.add("description");
        collectionDescription.innerText = "THIS IS A TEMPORARY TEXT HOLDER!";

        const evenRow = index % 2 == 0;
        collectionNav.style.float = evenRow ? "left" : "right";
        collectionNav.style.width = "60%";
        collectionDescription.style.float = evenRow ? "right" : "left";
        collectionDescription.style.width = "37%";

        newCollection.appendChild(collectionNav);
        newCollection.appendChild(collectionDescription);
        collectionsHTML.appendChild(newCollection);
      });
    });
}

/**
 * Shows the product information. Triggers upon clicking on a product listed in one of the
 * product listing HTML pages.
 */
async function showProductInformation() {
  const selectedProduct = window.localStorage.getItem("selectedProduct");

  const URL = `http://localhost:6969/products/${selectedProduct}`;
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
      name.innerHTML = `${product.name}<hr>`;
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
async function showProducts(
  store = window.localStorage.getItem("store"),
  gender = window.localStorage.getItem("gender"),
  style = window.localStorage.getItem("style")
) {
  console.log(store, gender, style);
  const active = document.getElementsByClassName("active")[0];
  if (active) active.classList.remove("active");
  document.querySelector(`.${gender}`).classList.add("active");

  const productsHTML = document.getElementsByClassName("products")[0];
  productsHTML.innerHTML = "";

  const URL =
    store == "all"
      ? `http://localhost:6969/products/gender/${gender}/style/${style}`
      : `http://localhost:6969/stores/${store}/gender/${gender}/style/${style}`;

  await fetch(URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((products) => {
      products.map((product) => {
        const newProduct = document.createElement("div");
        newProduct.classList.add("product");
        newProduct.id = product._id;
        newProduct.onclick = () => goToProduct(product._id);

        const productImage = document.createElement("div");
        productImage.classList.add("image");
        const image = document.createElement("img");
        image.src = product.image_url;
        image.alt = "product_img";
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
  const bagHTML = document.querySelector(".bag");
  const itemsHTML = document.querySelector(".items");

  await fetch(`http://localhost:6969/users/${userId}/cart`, {
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

        await fetch(`http://localhost:6969/products/${item.product}`, {
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
