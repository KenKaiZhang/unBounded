/**
 * This is all the location manipulation scripts. goTo followed by the word changes
 * the webpage to displace the named HTML. Used localStorage to save data from one
 * HTML to another.
 */

function returnToStore() {
  window.localStorage.removeItem("brand");
  window.localStorage.removeItem("gender");
  window.localStorage.removeItem("style");
  window.location.href = "/store.html";
}

function goToBrand(brandId, gender) {
  window.localStorage.setItem("brand", brandId);
  window.localStorage.setItem("gender", gender);
  window.localStorage.removeItem("style");
  window.location.href = `/brand.html`;
}

function goToProducts(gender) {
  window.localStorage.setItem("gender", gender);
  window.location.href = "/products.html";
}

function goToProduct(productId) {
  window.localStorage.setItem("selectedProduct", productId);
  window.location.href = "/product.html";
}

function goToCollectionOrProducts() {
  if (window.localStorage.getItem("store") == "all") {
    window.localStorage.setItem("style", "all");
    window.location.href = "/products.html";
  } else {
    window.location.href = "/collection.html";
  }
}

function goToCart() {
  window.location.href = "/checkout.html";
}
