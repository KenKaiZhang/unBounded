/**
 * Mainly for collection.html. Detechs the height of the menu bar and once the top
 * of the menu bar div hits a height of pixel, stick it so the menu bar doesnt keep
 * scrolling upwards.
 */
function setStickyFilter() {
  const filterBar = document.querySelector(".bar");
  const filterSide = document.querySelector(".sidebar");
  const content = document.querySelector(".content");

  window.addEventListener(
    "scroll",
    (event) => {
      const contentTop = content.offsetTop - document.body.scrollTop;
      if (contentTop < 130) {
        filterBar.style.position = "fixed";
        filterBar.style.top = "80px";
        filterBar.style.boxShadow = "1px 1px 10px #707070";
        filterSide.style.display = "flex";
        filterSide.style.position = "fixed";
        filterSide.style.top = "130px";
      } else {
        filterBar.style.position = null;
        filterBar.style.top = null;
        filterBar.style.boxShadow = "none";
        filterBar.style.left = 0;
        if (filterSide.classList.contains("active")) {
          filterSide.classList.remove("active");
        }
      }
    },
    false
  );
}

/**
 * Shows the styles found through the PRODUCTS database. Can filter based on
 * collection (for collection.html) or just simply by the gender (which is used
 * for both sorts since male and femal have different styles of clothing).
 */
function showStyleFilters() {
  const stylesHTML = document.querySelector(".styles");
  stylesHTML.innerHTML = "<h3>STYLES<hr/></h3>";

  const collectionId = window.localStorage.getItem("store");
  const gender = document.querySelector(".active").classList[0];

  const URL =
    collectionId == "all"
      ? `http://localhost:6969/products/style/${gender}`
      : `http://localhost:6969/stores/${collectionId}/style/${gender}`;

  fetch(URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((styles) => {
      styles.map((style) => {
        const styleDiv = document.createElement("div");
        styleDiv.classList.add("style");
        styleDiv.onclick = () => showProducts(collectionId, gender, style);
        const styleText = document.createElement("p");
        styleText.innerText = style;
        styleDiv.appendChild(styleText);
        stylesHTML.appendChild(styleDiv);
      });
    });
}

// Opens and close the filter menu.
function toggleFilterNav() {
  const content = document.querySelector(".content");
  if (content.offsetTop - document.body.scrollTop < 130) {
    document.querySelector(".sidebar").classList.toggle("active");
  }
}
