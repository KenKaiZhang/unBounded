import { assignCart } from "./cookie.js";

// const baseUrl = "https://data.unboundedsw.com";
export const baseUrl = "https://data.unboundedsw.com";

export function getCartId() {
  return assignCart();
}
