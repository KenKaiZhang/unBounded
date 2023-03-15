import { assignCart } from "./cookie.js";

const baseUrl = "https://data.unboundedsw.com";
const cartId = assignCart();

export { baseUrl, cartId };
