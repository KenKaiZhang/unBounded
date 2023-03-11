import { baseUrl } from "./init.js";
import { goToBrand, goToProduct } from "./goto.js";

/**
 * Shows brands by country selected
 */
export async function showBrands(country = "everywhere") {
  const brandsHTML = document.querySelector(".brands");
  brandsHTML.innerHTML = "";
  await fetch(`${baseUrl}/brands/country/${country}`, {
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
        newBrand.classList.add("brand");

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
        menButton.addEventListener("click", () => goToBrand(brand._id, "Men"));
        const womenButton = document.createElement("button");
        womenButton.classList.add("women");
        womenButton.innerText = "WOMEN";
        womenButton.addEventListener("click", () =>
          goToBrand(brand._id, "Women")
        );

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

export async function showBrandName(location) {
  const request = JSON.parse(window.localStorage.getItem("request"));
  const locationHTML = document.querySelector(location);
  if (request.brand === undefined) {
    locationHTML.innerText = "Products";
  } else {
    fetch(`${baseUrl}/brands/${request.brand}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((brand) => (locationHTML.innerText = brand.name));
  }
}

/**
 * Shows the product information. Triggers upon clicking on a product listed in one of the
 * product listing HTML pages.
 */
export async function showProductInformation() {
  const selectedProduct = window.localStorage.getItem("product");

  await fetch(`${baseUrl}/products/${selectedProduct}`, {
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
export async function showProducts() {
  const request = JSON.parse(window.localStorage.getItem("request"));
  const active = document.getElementsByClassName("active")[0];
  if (active) active.classList.remove("active");
  document
    .querySelector(`#${request.gender.toLowerCase()}`)
    .classList.add("active");

  const productsHTML = document.getElementsByClassName("products")[0];
  productsHTML.innerHTML = "";
  await fetch(`${baseUrl}/products/filter`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
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
 * Show basic user information
 */
export async function showBasicInformation() {}
