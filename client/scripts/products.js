import { barGenderFilterEvent, showStyleFilters } from "./utils/filter.js";
import { showProducts } from "./utils/show.js";

// Set some missing styles for menu bar
const menuBar = document.querySelector(".bar");
menuBar.style.boxShadow = " 1px 1px 10px #707070";
menuBar.style.top = "80px";

showProducts();
showStyleFilters();
barGenderFilterEvent();
