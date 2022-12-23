function getProductInformation() {
  const selectedProduct = window.localStorage.getItem("selectedProduct");
  fetch(`http://localhost:6969/products/${selectedProduct}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((product) => {});
}
