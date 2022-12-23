function showProducts(
  gender = window.localStorage.getItem("gender"),
  style = window.localStorage.getItem("style")
) {
  const active = document.getElementsByClassName("active")[0];
  if (active) active.classList.remove("active");
  document.querySelector(`.${gender}`).classList.add("active");

  const productsHTML = document.querySelector(".products");
  productsHTML.innerHTML = "";
  fetch(`http://localhost:6969/products`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((products) => {
      products.map((product) => {
        if (product.gender == gender) {
          console.log(product.gender);
          if (style == "all" || product.style == style) {
            const newProduct = document.createElement("div");
            newProduct.classList.add("product");
            newProduct.id = product._id;

            const image = document.createElement("img");
            image.src = product.image_url;
            image.alt = "product_img";

            const productInfo = document.createElement("div");
            productInfo.classList.add("info");
            const name = document.createElement("p");
            name.innerText = product.name;
            const price = document.createElement("p");
            price.innerText = product.price;
            productInfo.appendChild(name);
            productInfo.appendChild(price);

            newProduct.appendChild(image);
            newProduct.appendChild(productInfo);
            productsHTML.appendChild(newProduct);
          }
        }
      });
    });
}

function styleFilters() {
  const stylesHTML = document.querySelector(".styles");
  stylesHTML.innerHTML = "<h3>STYLES<hr/></h3>";
  const storeId = window.localStorage.getItem("store");
  fetch(`http://localhost:6969/stores/${storeId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((store) => {
      const gender = document.querySelector(".active").classList[0];
      let styles;
      if (gender == "male") styles = store.male_styles;
      else if (gender == "female") styles = store.female_styles;
      styles.map((style) => {
        const styleDiv = document.createElement("div");
        styleDiv.classList.add("style");
        styleDiv.onclick = () => showProducts(gender, style);
        const styleText = document.createElement("p");
        styleText.innerText = style;
        styleDiv.appendChild(styleText);
        stylesHTML.appendChild(styleDiv);
      });
    });
}

function toggleNav() {
  const sideNav = document.querySelector(".side");
  if (sideNav.style.display == "flex") {
    sideNav.style.display = "none";
  } else {
    sideNav.style.display = "flex";
  }
}

function goToStore() {
  window.location.href = "http://127.0.0.1:5500/store.html";
}
