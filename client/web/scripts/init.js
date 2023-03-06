if (document.cookie === "") {
  console.log("HERE");
  fetch("https://data.unboundedsw.com/customers", {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((customer) => {
      document.cookie = `userId=${customer};`;
      console.log(document.cookie);
    });
}
