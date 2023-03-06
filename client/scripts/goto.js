/**
 * This is all the location manipulation scripts. goTo followed by the word changes
 * the webpage to displace the named HTML. Used localStorage to save data from one
 * HTML to another.
 */

function makeRequest(request) {
  window.localStorage.setItem("request", JSON.stringify(request));
}

function returnToStore() {
  window.location.href = "/store.html";
}

function goToBrand(brandId, gender) {
  makeRequest({ brand: brandId, gender: gender });
  window.location.href = `/brand.html`;
}

function goToProducts(gender) {
  makeRequest({ gender: gender });
  window.location.href = "/products.html";
}

function goToProduct(productId) {
  window.localStorage.setItem("product", productId);
  window.location.href = "/product.html";
}

function goToBrandOrProducts() {
  const request = JSON.parse(window.localStorage.getItem("request"));
  console.log(request.brandId);
  window.location.href =
    request.brand === undefined
      ? (window.location.href = "/products.html")
      : (window.location.href = "/brand.html");
}

function goToCart() {
  window.location.href = "/checkout.html";
}
function goToLink(link) {
  window.parent.location.href = link;
}
