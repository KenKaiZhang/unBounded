export function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function assignCart() {
  let customerId = getCookie("customerId");
  if (customerId == "") {
    fetch(`https://data.unboundedsw.com/carts`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((customer) => {
        setCookie("customerId", customer, 7);
        customerId = getCookie("customerId");
      });
  }
  return customerId;
}
