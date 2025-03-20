let searchbtn = document.getElementById("searchbtn");
let clearbtn = document.getElementById("clearbtn");
let result = document.getElementById("resultContainer");
let mydiv = document.getElementById("dropdown");
let close = document.getElementById("close-btn");
let query = document.getElementById("searchinput");

const clearsearch = () => {
  query.value = ""; // Clear the search input field
  mydiv.style.display = "none"; // Hide the result dropdown
  result.innerHTML = ""; // Clear results
  console.log("Search cleared!"); // Debugging message
};

clearbtn.addEventListener("click", clearsearch); // Event listener to clear the search

const showResult = (name, img, info, url) => {
  console.log("Showing result: ", name); // Debugging log to check if results are showing correctly
  mydiv.style.display = "block"; // Show the result dropdown if it's hidden

  // Create a div for each result item
  let itemElement = document.createElement("div");
  itemElement.classList.add("result-item"); // Add a class for styling

  // Populate the result item with dynamic content
  itemElement.innerHTML = `
    <h3>${name}</h3>
    <img class="search-img" src="${img}" alt="search-result">
    <p class="description">${info}</p>
    <a href="${url}" target="_blank">
      <button class="visitbtn">Visit</button>
    </a>
  `;

  // Append the new item to the result container
  result.appendChild(itemElement);
};

const showDropdown = (category, items) => {
  mydiv.style.display = "block"; // Show the result dropdown if it's hidden

  let dropdownHTML = `<div class="dropdown-content">`;
  items.forEach((item) => {
    dropdownHTML += `
      <div class="dropdown-item">
        <h3>${item.name}</h3>
        <img class="search-img" src="${item.imageUrl}" alt="${item.name}">
        <p>${item.description}</p>
        <a href="${item.url}" target="_blank">
          <button class="visitbtn">Visit</button>
        </a>
      </div>
    `;
  });
  dropdownHTML += `</div>`;

  // Set the content for the dropdown
  result.innerHTML = `<h3>${category}</h3>` + dropdownHTML;
  
  // Adding space after the dropdown content (line break or custom margin)
  result.innerHTML += "<br>";  // Simple line break
};

const closeDropdown = () => {
  mydiv.style.display = "none"; // Hide the dropdown when the close button is clicked
  query.value = ""; // Clear the input field when the dropdown is closed
};

close.addEventListener("click", closeDropdown); // Event listener to close the dropdown

const searchError = () => {
  console.log("No results found!"); // Debugging log for search error
  result.innerHTML = `<p class="notfound">Sorry, we can't find your search.</p>`; // Display an error if no results are found
};

fetch("travel_recommendation_api.json")
  .then((res) => {
    if (!res.ok) {
      throw new Error("Failed to load data"); // Handle error if data fetch fails
    }
    return res.json();
  })
  .then((data) => {
    console.log("Data loaded successfully:", data); // Log data to check if it's loading correctly

    const search = () => {
      let searchQuery = query.value.toLowerCase().trim(); // Get the search query and convert it to lowercase
      console.log("Search query:", searchQuery); // Debugging log for search query

      if (searchQuery === "") {
        console.log("Search query is empty. No search performed.");
        return; // If search query is empty, do nothing
      }

      let notfound = true; // Flag to track if any results are found
      result.innerHTML = "<p>Searching...</p>"; // Show a "Searching..." message while looking for results

      // Search for 'countries' - display all countries
      if (searchQuery === "countries") {
        data.countries.forEach((country) => {
          showResult(country.name, "", "Click below to explore cities.", "", true, country.cities); // Show dropdown for cities
          notfound = false;
        });
      }

      // Search for 'temples' - display all temples with id, name, imageUrl, description, and url
      else if (searchQuery === "temples") {
        showDropdown("Temples", data.temples);
        notfound = false;
      }

      // Search for 'beaches' - display all beaches with id, name, imageUrl, description, and url
      else if (searchQuery === "beaches") {
        showDropdown("Beaches", data.beaches);
        notfound = false;
      }

      // Loop through countries and cities
      else {
        // Search for countries by name
        data.countries.forEach((country) => {
          if (country.name.toLowerCase().includes(searchQuery)) {
            // If country name matches, display the cities under that country
            showDropdown("Cities in " + country.name, country.cities);
            notfound = false;
          }
        });

        // Loop through cities within a country
        data.countries.forEach((country) => {
          country.cities.forEach((city) => {
            if (city.name.toLowerCase().includes(searchQuery)) {
              showResult(city.name, city.imageUrl, city.description, city.url);
              notfound = false;
            }
          });
        });

        // Loop through temples and display matching results with id, name, imageUrl, description, and url
        data.temples.forEach((temple) => {
          if (temple.name.toLowerCase().includes(searchQuery)) {
            showResult(temple.name, temple.imageUrl, temple.description, temple.url);
            notfound = false;
          }
        });

        // Loop through beaches and display matching results with id, name, imageUrl, description, and url
        data.beaches.forEach((beach) => {
          if (beach.name.toLowerCase().includes(searchQuery)) {
            showResult(beach.name, beach.imageUrl, beach.description, beach.url);
            notfound = false;
          }
        });
      }

      // If no results are found, display an error message
      if (notfound) {
        searchError();
      }
    };

    searchbtn.addEventListener("click", search); // Trigger search when the search button is clicked
    query.addEventListener("input", search); // Trigger search as you type
  })
  .catch((error) => {
    console.error("Error loading data:", error); // Log any fetch errors
  });
