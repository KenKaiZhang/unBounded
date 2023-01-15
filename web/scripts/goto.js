/**
 * This is all the location manipulation scripts. goTo followed by the word changes
 * the webpage to displace the named HTML. Used localStorage to save data from one
 * HTML to another.
 */

function goToStore() {
  window.location.href = "http://127.0.0.1:5500/store.html";
}

function goToCollection(collectionId, gender, style) {
  window.localStorage.setItem("store", collectionId);
  window.localStorage.setItem("gender", gender);
  window.localStorage.setItem("style", style);
  window.location.href = "http://127.0.0.1:5500/collection.html";
}

function goToProducts(collectionId, gender, style) {
  window.localStorage.setItem("store", collectionId);
  window.localStorage.setItem("gender", gender);
  window.localStorage.setItem("style", style);

  window.location.href = "http://127.0.0.1:5500/products.html";
}

function goToProduct(productId) {
  window.localStorage.setItem("selectedProduct", productId);
  window.location.href = "http://127.0.0.1:5500/product.html";
}

function goToCollectionOrProducts() {
  if (window.localStorage.getItem("store") == "all") {
    window.localStorage.setItem("style", "all");
    window.location.href = "http://127.0.0.1:5500/products.html";
  } else {
    window.location.href = "http://127.0.0.1:5500/collection.html";
  }
}

function goToCart() {
  window.location.href = "http://127.0.0.1:5500/checkout.html";
}
