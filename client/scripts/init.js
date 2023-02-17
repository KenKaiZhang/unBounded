if (document.cookie == "") {
  console.log("HERE");
  fetch("https://data.unboundedsw.com/customers", {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((user) => {
      console.log("THere");
      document.cookie = `userId=${user._id};`;
    });
}

console.log("COOKIE: ", document.cookie);
