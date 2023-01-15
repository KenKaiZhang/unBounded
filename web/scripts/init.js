if (document.cookie == "") {
  fetch("http://localhost:6969/users", {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((user) => {
      document.cookie = `userId=${user._id};`;
    });
}

console.log("COOKIE: ", document.cookie);
