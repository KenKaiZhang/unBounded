function showProducts(
  store = window.localStorage.getItem("store"),
  gender = window.localStorage.getItem("gender"),
  style = window.localStorage.getItem("style")
) {
  const active = document.getElementsByClassName("active")[0];
  if (active) active.classList.remove("active");
  console.log(store, gender, style);
  document.querySelector(`.${gender}`).classList.add("active");

  const productsHTML = document.getElementsByClassName("products")[0];
  productsHTML.innerHTML = "";

  fetch(`http://localhost:6969/stores/${store}/products`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((products) => {
      products.map((product) => {
        if (product.gender == gender) {
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

function stickyFilter() {
  const filterBar = document.querySelector(".bar");
  const filterSide = document.querySelector(".side");
  const content = document.querySelector(".content");

  window.addEventListener(
    "scroll",
    (event) => {
      const contentTop = content.offsetTop - document.body.scrollTop;
      if (contentTop < 130) {
        filterBar.style.position = "fixed";
        filterBar.style.top = "80px";
        filterBar.style.boxShadow = "3px 3px 5px #000000";
        filterSide.style.position = "fixed";
        filterSide.style.top = "116px";
      } else {
        filterBar.style.position = null;
        filterBar.style.top = null;
        filterBar.style.boxShadow = "none";
        filterSide.style.position = null;
        filterSide.style.top = null;
      }
    },
    false
  );
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
        styleDiv.onclick = () => showProducts(storeId, gender, style);
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
