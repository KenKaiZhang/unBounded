import {
  barGenderFilterEvent,
  setStickyFilter,
  showStyleFilters,
} from "./utils/filter.js";
import { showBrandName, showProducts } from "./utils/show.js";

showBrandName(".brand-name p");
showProducts();
setStickyFilter();
showStyleFilters();
barGenderFilterEvent();
