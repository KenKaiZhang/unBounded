const baseUrl = "https://data.unboundedsw.com";

if (document.cookie === "" || document.cookie === undefined) {
  fetch(`${baseUrl}/customers`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((customer) => {
      document.cookie = `userId=${customer};`;
    });
}
const customerId = document.cookie.split("userId=")[1];
