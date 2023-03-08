import { assignCart } from "./cookie.js";

const baseUrl = "http://localhost:7222";
const cartId = assignCart();

export { baseUrl, cartId };
