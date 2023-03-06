const baseUrl = "http://localhost:7222";

if (document.cookie === "" || document.cookie === undefined) {
  fetch(`${baseUrl}/customers`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((customer) => {
      console.log(customer);
      document.cookie = `userId=${customer};`;
      console.log(document.cookie);
    });
}
const customerId = document.cookie.split("userId=")[1];
console.log(customerId);
