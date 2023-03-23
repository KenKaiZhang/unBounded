import { assignCart } from "./cookie.js";

// const baseUrl = "https://data.unboundedsw.com";
const baseUrl = "http://localhost:7222";
const cartId = assignCart();

export { baseUrl, cartId };
