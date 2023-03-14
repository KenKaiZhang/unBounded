import { showBrands } from "./utils/show.js";
import { baseUrl } from "./utils/init.js";
import { goToProducts } from "./utils/goto.js";

// Start off by showing all the brands with no filters
showBrands();

// Setting show all brands filter
document
  .querySelector("#everywhere")
  .addEventListener("click", () => showBrands());

// Show available countries to filter
const productNavHTML = document.querySelector(".countries-filter");
await fetch(`${baseUrl}/brands/options/countries`, {
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
      newCountry.addEventListener("click", () => showBrands(country));
      productNavHTML.appendChild(newCountry);
    });
  });

// Set go to all products page
["Men", "Women"].map((gender) => {
  document
    .querySelector(`#${gender.toLowerCase()}`)
    .addEventListener("click", () => {
      goToProducts(gender);
    });
});

document.querySelector(".toggle #button").addEventListener("click", () => {
  const filtersHTML = document.querySelector(".filters");
  filtersHTML.id = filtersHTML.id === "show" ? null : "show";
});