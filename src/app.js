const details = document.querySelector("#brewry-details");
const randomBtn = document.querySelector("#random-brewery-button");
const zipForm = document.querySelector("#form-by-zip");
const dropDownZip = document.querySelector("#brew-drop-down");
const faveDropDown = document.querySelector("#favorites-drop-menu");

fetchFavorites();

let zipCode = "";

function fetchZipBrew() {
  fetch(
    `https://api.openbrewerydb.org/breweries?by_postal=${zipCode}&per_page=25`
  )
    .then((response) => response.json())
    .then((brewries) => {
      const emptyOption = document.createElement("option");
      dropDownZip.append(emptyOption);
      brewries.forEach((brewery) => {
        renderBrewToDropDownZip(brewery, dropDownZip);
      });
    });
}

function renderBrewToDropDownZip(brewery, dropMenu) {
  const brewOptions = document.createElement("option");

  brewOptions.textContent = brewery.name;
  brewOptions.value = brewery.name;
  dropMenu.append(brewOptions);
}

zipForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const zipInput = document.querySelector("#zip-code");
  zipCode = zipInput.value;
  dropDownZip.replaceChildren();

  fetchZipBrew();
  zipForm.reset();
});

function fetchRandomBrewery() {
  fetch("https://api.openbrewerydb.org/breweries/random", { cache: "no-store" })
    .then((response) => response.json())
    .then((brewery) => renderBreweryDetails(brewery[0]));
}

randomBtn.addEventListener("click", () => {
  fetchRandomBrewery();
  details.replaceChildren();
});

function renderBreweryDetails(brewery) {
  const cardDetails = document.createElement("div");
  cardDetails.id = "card-details-brew";
  const breweryName = document.createElement("h2");
  const breweryType = document.createElement("h3");
  const breweryStreet = document.createElement("p");
  const breweryCity = document.createElement("p");
  const breweryState = document.createElement("p");
  const breweryZipCode = document.createElement("p");
  const breweryPhone = document.createElement("p");
  const breweryWebsite = document.createElement("a");
  const likeButton = document.createElement("button");

  breweryName.textContent = brewery.name;
  breweryType.textContent = "Brewery Type: " + brewery.brewery_type;

  if (!brewery.street) {
    breweryStreet.textContent = "Street: Unknown";
  } else {
    breweryStreet.textContent = "Street: " + brewery.street;
  }

  breweryCity.textContent = "City: " + brewery.city;
  breweryState.textContent = "State: " + brewery.state;
  breweryZipCode.textContent = "Zip: " + brewery.postal_code;
  breweryPhone.textContent = "Phone Number: " + brewery.phone;
  if (!brewery.website_url) {
    breweryWebsite.style.display = "none";
  } else {
    breweryWebsite.href = brewery.website_url;
    breweryWebsite.target = "_blank";
    breweryWebsite.textContent = "Brewery Website";
  }
  likeButton.textContent = "Favorite!";
  likeButton.id = "favorite-btn";

  likeButton.addEventListener("click", () => {
    console.log(breweryName.textContent);

    fetch();
  });

  cardDetails.append(
    breweryName,
    breweryType,
    breweryStreet,
    breweryCity,
    breweryState,
    breweryZipCode,
    breweryWebsite,
    breweryPhone,
    likeButton
  );
  details.append(cardDetails);
}

dropDownZip.addEventListener("change", () => {
  const dropValueSplit = dropDownZip.value.split(" ");
  const dropValueWithDashes = dropValueSplit.join("_");

  fetch(
    `https://api.openbrewerydb.org/breweries?by_name=${dropValueWithDashes}&by_postal=${zipCode}&per_page=3`
  )
    .then((response) => response.json())
    .then((brewery) => {
      details.replaceChildren();
      renderBreweryDetails(brewery[0]);
    });
});

function fetchFavorites() {
  fetch("http://localhost:3000/favorites")
    .then((response) => response.json())
    .then((favoritesArray) => {
      const emptyOption = document.createElement("option");
      emptyOption.textContent = "";
      faveDropDown.appendChild(emptyOption);
      favoritesArray.forEach((favorite) => {
        renderBrewToDropDownZip(favorite, faveDropDown);
      });
    });
}
