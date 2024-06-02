const axios = require("axios");
const fs = require("fs").promises;

// Interested subjects focused on fiction and related genres
const interestedSubjects = [
	"fiction",
	"romance",
	"young adult",
	"fantasy",
	"thrillers",
	"suspense",
	"action and adventure",
	"fantasy fiction",
	"juvenile fiction",
	"history",
	"literary fiction",
	"love stories",
	"erotic fiction",
	"epic",
	"crime",
	"horror",
	"science fiction",
	"coming of age",
	"time travel",
	"alternative history",
	"romantic comedy",
	"comics",
	"friendship",
	"mystery",
];

// Set to store fetched book ISBNs
const fetchedIsbns = new Set();

// Function to fetch books for a subject with pagination and year filtering
async function fetchBooksForSubject(
	subject,
	totalBooksToFetch = 10000,
	startYear = 2010
) {
	const books = [];
	const maxRetries = 3; // Maximum number of retries
	const retryDelay = 5000; // Delay between retries in milliseconds
	const maxBooksPerCall = 1000; // Maximum number of books per API call
	const numAsyncCalls = Math.ceil(totalBooksToFetch / maxBooksPerCall); // Number of async calls needed

	for (let call = 0; call < numAsyncCalls; call++) {
		let offset = call * maxBooksPerCall;
		let retryCount = 0;
		while (retryCount < maxRetries) {
			try {
				const url = `https://openlibrary.org/subjects/${subject}.json?limit=${maxBooksPerCall}&offset=${offset}&published_in=${startYear}-`;
				const response = await axios.get(url);
				const data = response.data;
				const works = data.works || [];
				if (works.length === 0) {
					console.log("No more works found");
					break;
				}
				for (const work of works) {
					const isbn = work.cover_edition_key;
					if (!fetchedIsbns.has(isbn)) {
						books.push(work);
						fetchedIsbns.add(isbn);
						if (books.length >= totalBooksToFetch) {
							break;
						}
					}
				}
				console.log(
					`Fetched ${books.length} books for subject '${subject}' so far...`
				);
				break; // Exit retry loop if successful
			} catch (error) {
				console.error(
					`Error fetching books for subject '${subject}' (Async Call ${
						call + 1
					}, Retry ${retryCount + 1}): ${error.message}`
				);
				retryCount++;
				if (retryCount < maxRetries) {
					console.log(`Retrying after ${retryDelay / 1000} seconds...`);
					await sleep(retryDelay);
				} else {
					console.error(
						`Max retries exceeded for subject '${subject}' (Async Call ${
							call + 1
						}). Skipping...`
					);
					break;
				}
			}
		}
	}
	return books.slice(0, totalBooksToFetch);
}

// Simulate sleep function
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Fetch books for all subjects with a focus on recent publications
async function fetchBooks() {
	const subjectPromises = interestedSubjects.map((subject) =>
		fetchBooksForSubject(subject)
	);
	return await Promise.all(subjectPromises);
}

function parseBooksData(books) {
	return books.map((book) => ({
		ISBN: book.cover_edition_key,
		"Book-Title": book.title,
		"Book-Author":
			book.authors && book.authors.length > 0 ? book.authors[0].name : null,
		"Year-Of-Publication": book.first_publish_year,
		Publisher: null, // Open Library API doesn't provide publisher directly
		"Image-URL-S": book.cover_id
			? `http://covers.openlibrary.org/b/id/${book.cover_id}-S.jpg`
			: null,
		"Image-URL-M": book.cover_id
			? `http://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
			: null,
		"Image-URL-L": book.cover_id
			? `http://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`
			: null,
	}));
}

async function writeToCsv(data) {
	try {
		const csvData = data
			.map((book) => Object.values(book).join(","))
			.join("\n");
		await fs.writeFile("books.csv", csvData);
		console.log("Data saved to CSV successfully.");
	} catch (error) {
		console.error("Error writing data to CSV:", error);
	}
}

// Main function to fetch, parse, and save data to CSV
async function main() {
	try {
		const books = await fetchBooks();
		const flattenedBooks = books.flat(); // Flatten the array of arrays
		const booksData = parseBooksData(flattenedBooks);
		await writeToCsv(booksData);
	} catch (error) {
		console.error("An error occurred:", error);
	}
}

// Run the main function
main();
