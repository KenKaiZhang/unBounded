import { baseUrl } from "./init.js";
import { showProducts } from "./show.js";
/**
 * Mainly for collection.html. Detechs the height of the menu bar and once the top
 * of the menu bar div hits a height of pixel, stick it so the menu bar doesnt keep
 * scrolling upwards.
 */
export function setStickyFilter() {
  const filterBar = document.querySelector(".bar");
  const filterSide = document.querySelector(".sidebar");

  window.addEventListener(
    "scroll",
    () => {
      const welcomeBot =
        document.querySelector(".welcome").clientHeight - window.scrollY;
      if (welcomeBot < 60) {
        filterBar.style.position = "fixed";
        filterBar.style.top = "60px";
        filterSide.style.display = "flex";
        filterSide.style.position = "fixed";
        filterSide.style.top = "100px";
      } else {
        filterBar.style.position = "relative";
        filterBar.style.top = "0px";
        filterBar.style.left = 0;
        if (filterSide.classList.contains("active")) {
          filterSide.classList.remove("active");
          document.querySelector("#menu #button").checked = false;
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
export function showStyleFilters() {
  const request = JSON.parse(window.localStorage.getItem("request"));

  const stylesHTML = document.querySelector(".styles");
  stylesHTML.innerHTML = "";

  const allStyles = document.createElement("div");
  allStyles.classList.add("style", "active");
  allStyles.id = "all";
  allStyles.addEventListener("click", () => {
    document.querySelector(".styles .active").classList.toggle("active");
    allStyles.classList.toggle("active");
    delete request.style;
    window.localStorage.setItem("request", JSON.stringify(request));
    showProducts();
  });
  allStyles.innerHTML = `<p>All Styles</p>`;
  stylesHTML.appendChild(allStyles);

  fetch(`${baseUrl}/products/options`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      option: "style",
      query: request,
    }),
  })
    .then((res) => res.json())
    .then((styles) => {
      styles.map((style) => {
        const newStyle = document.createElement("div");
        newStyle.classList.add("style");
        newStyle.id = style;
        newStyle.addEventListener("click", () => {
          request.style = style;
          document.querySelector(".styles .active").classList.toggle("active");
          newStyle.classList.toggle("active");
          window.localStorage.setItem("request", JSON.stringify(request));
          showProducts();
        });

        newStyle.innerHTML = `<p>${style}</p>`;
        stylesHTML.appendChild(newStyle);
      });
    });
}

// Opens and close the filter menu.
export function toggleSideFilter() {
  const content = document.querySelector(".content");
  if (content.offsetTop - document.body.scrollTop < 130) {
    document.querySelector(".sidebar").classList.toggle("active");
  }
}

export function barGenderFilterEvent() {
  const genders = ["Men", "Women"];
  genders.map((gender) => {
    document
      .querySelector(`#${gender.toLocaleLowerCase()}`)
      .addEventListener("click", () => {
        const request = JSON.parse(window.localStorage.getItem("request"));
        delete request.style;
        request.gender = gender;
        window.localStorage.setItem("request", JSON.stringify(request));
        showStyleFilters();
        showProducts();
      });
  });
}
