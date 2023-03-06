/**
 * Mainly for collection.html. Detechs the height of the menu bar and once the top
 * of the menu bar div hits a height of pixel, stick it so the menu bar doesnt keep
 * scrolling upwards.
 */
function setStickyFilter() {
  const filterBar = document.querySelector(".bar");
  const filterSide = document.querySelector(".sidebar");
  const content = document.querySelector(".content");

  window.addEventListener(
    "scroll",
    (event) => {
      const contentTop = content.offsetTop - document.body.scrollTop;
      if (contentTop < 130) {
        filterBar.style.position = "fixed";
        filterBar.style.top = "80px";
        filterBar.style.boxShadow = "1px 1px 10px #707070";
        filterSide.style.display = "flex";
        filterSide.style.position = "fixed";
        filterSide.style.top = "130px";
      } else {
        filterBar.style.position = null;
        filterBar.style.top = null;
        filterBar.style.boxShadow = "none";
        filterBar.style.left = 0;
        if (filterSide.classList.contains("active")) {
          filterSide.classList.remove("active");
        }
      }
    },
    false
  );
}

/**
 * Shows the styles found through the PRODUCTS database. Can filter based on
 * collection (for collection.html) or just simply by the gender (which is used
 * for both sorts since male and femal have different styles of clothing).
 */
function showStyleFilters() {
  const request = JSON.parse(window.localStorage.getItem("request"));
  console.log(request);

  const stylesHTML = document.querySelector(".styles");
  stylesHTML.innerHTML = "";

  const allStyles = document.createElement("div");
  allStyles.classList.add("style");
  allStyles.onclick = () => {
    delete request.style;
    window.localStorage.setItem("request", JSON.stringify(request));
    showProducts();
  };
  allStyles.innerHTML = `<p>All Styles</p>`;
  stylesHTML.appendChild(allStyles);

  fetch("https://data.unboundedsw.com/products/options", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      option: "style",
      query: request,
    }),
  })
    .then((res) => res.json())
    .then((styles) => {
      styles.map((style) => {
        const newStyle = document.createElement("div");
        newStyle.classList.add("style");
        newStyle.onclick = () => {
          request.style = style;
          window.localStorage.setItem("request", JSON.stringify(request));
          showProducts();
        };
        newStyle.innerHTML = `<p>${style}</p>`;
        stylesHTML.appendChild(newStyle);
      });
    });
}

// function showCountryFilters(gender) {
//   window.localStorage.removeItem("style");

//   if (gender !== undefined) {
//     window.localStorage.setItem("gender", gender);
//   }
//   const selectedGender = window.localStorage.getItem("gender");
//   const countriesHTML = document.querySelector(".countries");
//   countriesHTML.innerHTML = "";

//   const allCountries = document.createElement("div");
//   allCountries.classList.add("style");
//   allCountries.onclick = () => {
//     window.localStorage.removeItem("style");
//     showProducts();
//   };
//   allCountries.innerHTML = `<p>All Countries</p>`;
//   countriesHTML.appendChild(allCountries);

//   fetch("https://data.unboundedsw.com/products/options", {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       option: "country",
//       query: {
//         gender: selectedGender,
//       },
//     }),
//   })
//     .then((res) => res.json())
//     .then((countries) => {
//       console.log(countries);
//       countries.map((country) => {
//         const newCountry = document.createElement("div");
//         newCountry.classList.add("country");
//         newCountry.onclick = () => {
//           window.localStorage.setItem("country", country);
//           showProducts();
//         };
//         newCountry.innerHTML = `<p>${country}</p>`;
//         stylesHTML.appendChild(newCountry);
//       });
//     });
// }

// Opens and close the filter menu.

function toggleFilterNav() {
  const content = document.querySelector(".content");
  if (content.offsetTop - document.body.scrollTop < 130) {
    document.querySelector(".sidebar").classList.toggle("active");
  }
}

function barGenderFilterEvent() {
  const genders = ["Men", "Women"];
  genders.map((gender) => {
    document.querySelector(`#${gender.toLocaleLowerCase()}`).onclick = () => {
      const request = JSON.parse(window.localStorage.getItem("request"));
      delete request.style;
      request.gender = gender;
      window.localStorage.setItem("request", JSON.stringify(request));
      showStyleFilters();
      showProducts();
    };
  });
}
