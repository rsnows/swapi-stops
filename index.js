const axios = require('axios');
const prompt = require('prompt-sync')();

// Ask the user for the distance he wants to base the stops count on
const input = prompt('How many mega lights do you want to travel? ');
console.log('\nFor this distance, with these starships, you would need to make:')

// Call the function with the first page url
const url = 'https://swapi.dev/api/starships/';
fetchStarships(url);

// Get the starships' information from SWAPI with axios
function fetchStarships(url) {
	axios.get(url)
	.then(response => {

		// Iterate through the starship list
		response.data.results.forEach(starship => {

			// Check if all the essential information is available
			if (starship.consumables !== 'unknown' && starship.MGLT !== 'unknown') {

				var consumables = starship.consumables;
				var multiplier = 0;

				// Define the hour multiplier by finding the time measure of the "consumables" property
				if (consumables.includes('day')) multiplier = 24;
				else if (consumables.includes('week')) multiplier = 168; 
				else if (consumables.includes('month')) multiplier = 730;
				else if (consumables.includes('year')) multiplier = 8760;

				// Calculate the number of stops needed by dividing the distance the user entered
				// by the amount of hours the ship can travel without a stop (from "consumables")
				var stops = Math.floor(input / (starship.MGLT * multiplier * consumables.match(/\d+/)[0]));

				// Print the number of stops needed for the current ship
				console.log(`${starship.name}: ${stops} stops`);

			} else {

				// Inform the user in case some information is missing
				console.log(`${starship.name}: not enough information`);
			}
		});
			// Call the function again if there are still pages to be read from SWAPI
			if (response.data.next) {
				fetchStarships(response.data.next)
			}
	})
	.catch(err => console.error(err.message));
}