// Fetch travel recommendation data from the JSON file
fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
        // Event listener for the Search button
        document.getElementById('search-btn').addEventListener('click', function() {
            const searchTerm = document.getElementById('search-bar').value.toLowerCase();
            let results = [];

            // Filter data based on search term (searching in countries, temples, and beaches)
            results = [
                ...filterData(data.countries, searchTerm),
                ...filterData(data.temples, searchTerm),
                ...filterData(data.beaches, searchTerm)
            ];

            // Display the results on the page
            displayResults(results);
        });

        // Event listener for the Clear button
        document.getElementById('clear-btn').addEventListener('click', function() {
            document.getElementById('search-bar').value = ''; // Clear the search input
            document.getElementById('results').innerHTML = ''; // Clear the displayed results
        });

        // Function to filter data based on the search term
        function filterData(items, searchTerm) {
            return items.filter(item => item.name.toLowerCase().includes(searchTerm));
        }

        // Function to display results
        function displayResults(results) {
            const resultsContainer = document.getElementById('results');
            resultsContainer.innerHTML = ''; // Clear any previous results

            // If no results found
            if (results.length === 0) {
                resultsContainer.innerHTML = '<p>No results found. Try searching for something else.</p>';
                return;
            }

            // Loop through the filtered results and display them
            results.forEach(item => {
                const resultItem = document.createElement('div');
                resultItem.classList.add('result-item');
                resultItem.innerHTML = `
                    <h3>${item.name}</h3>
                    <img src="${item.imageUrl}" alt="${item.name}" />
                    <p>${item.description}</p>
                `;
                resultsContainer.appendChild(resultItem);
            });
        }
    })
    .catch(error => {
        console.error('Error loading travel recommendation data:', error);
    });
