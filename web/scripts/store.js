async function showCollections() {
  const collectionsHTML = document.getElementsByClassName("collections")[0];
  collectionsHTML.innerHTML = "";

  await fetch(`http://localhost:6969/stores`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((stores) => {
      stores.map((store, index) => {
        const newCollection = document.createElement("div");
        newCollection.classList.add("collection");
        newCollection.id = store._id;

        const collectionNav = document.createElement("div");
        collectionNav.classList.add("nav");
        collectionNav.style.backgroundImage = `url(${store.store_image})`;

        const storeName = document.createElement("div");
        storeName.classList.add("name");
        const name = document.createElement("p");
        name.innerText = store.name;
        storeName.appendChild(name);

        const navButtons = document.createElement("div");
        navButtons.classList.add("buttons");
        const menButton = document.createElement("button");
        menButton.classList.add("men");
        menButton.innerText = "MEN";
        menButton.onclick = () => goToCollection(store._id, "male", "all");
        const womenButton = document.createElement("button");
        womenButton.classList.add("women");
        womenButton.innerText = "WOMEN";
        womenButton.onclick = () => goToCollection(store._id, "female", "all");
        navButtons.appendChild(menButton);
        navButtons.appendChild(womenButton);

        collectionNav.appendChild(storeName);
        collectionNav.appendChild(navButtons);

        const collectionDescription = document.createElement("div");
        collectionDescription.classList.add("description");
        collectionDescription.innerText = "THIS IS A TEMPORARY TEXT HOLDER!";

        if (index % 2 == 0) {
          collectionNav.style.float = "left";
          collectionNav.style.width = "60%";
          collectionDescription.style.float = "right";
          collectionDescription.style.width = "37%";
        } else {
          collectionNav.style.float = "right";
          collectionNav.style.width = "60%";
          collectionDescription.style.float = "left";
          collectionDescription.style.width = "37%";
        }

        newCollection.appendChild(collectionNav);
        newCollection.appendChild(collectionDescription);
        collectionsHTML.appendChild(newCollection);
      });
    });
}

function goToCollection(storeId, gender, style) {
  window.localStorage.setItem("store", storeId);
  window.localStorage.setItem("gender", gender);
  window.localStorage.setItem("style", style);
  window.location.href = "http://127.0.0.1:5500/collection.html";
}

function goToProducts(gender, style) {
  window.localStorage.setItem("gender", gender);
  window.localStorage.setItem("style", style);
  window.location.href = "http://127.0.0.1:5500/products.html";
}
