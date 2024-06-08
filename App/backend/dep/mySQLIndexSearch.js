const express = require("express");
const Fuse = require("fuse.js");
const mysql = require("mysql2/promise");
const readline = require("readline");

const app = express();
app.use(express.json());

const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "nats",
	database: "bookmate",
});

const cache = {};

const lruCache = {
	maxSize: 10000,
	keys: [],
	set: function (query, results) {
		if (this.keys.length >= this.maxSize) {
			const removedKey = this.keys.shift();
			delete cache[removedKey];
		}
		this.keys.push(query);
		cache[query] = results;
	},
	get: function (query) {
		const index = this.keys.indexOf(query);
		if (index !== -1) {
			this.keys.splice(index, 1);
			this.keys.push(query);
		}
		return cache[query];
	},
};

async function createSearchQuery(query) {
	try {
		if (cache[query]) {
			console.log("Using cache for query:", query);
			return cache[query];
		}

		const fuse = new Fuse(Object.keys(cache), {
			includeScore: true,
			threshold: 0.9,
			location: 0.5,
		});
		const fuseResults = fuse.search(query);
		if (fuseResults.length > 0 && fuseResults[0].score >= 0.8) {
			const topResult = fuseResults[0].item;
			console.log("Found in cache:", topResult);
			return cache[topResult];
		}

		const conn = await connection;
		const [results] = await conn.query(
			`SELECT * FROM book WHERE MATCH(title) AGAINST ('${query}') LIMIT 5`
		);

		// Update LRU cache with top 5 results from MySQL query
		lruCache.set(query, results);
		console.log("Inserted into cache:", query);
		return results;
	} catch (error) {
		console.error(error);
	}
}

async function fetchBooks() {
	try {
		const conn = await connection;
		console.log("Searching");
		const [results, fields] = await conn.query(
			"SELECT * FROM book WHERE MATCH(title) AGAINST ('Percy jackson and the olym') "
		);
		console.log(results);
		console.log(fields);
	} catch (error) {
		console.log(error);
	}
}

async function showCache() {
	try {
		const keys = lruCache.keys.slice(-25);
		console.log("Latest 5 entries in the cache:");
		keys.forEach((key) => {
			const values = lruCache.get(key);
			console.log(`Key: ${key}, Values:`, values);
		});
	} catch (error) {
		console.error(error);
	}
}

async function main() {
	try {
		console.log("Database connected. Enter search queries:");

		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		rl.on("line", async (line) => {
			const matches = await createSearchQuery(line);
			const titles = matches.map((result) => result.Title);
			console.log("Matching titles:", titles);
			showCache();
		});

		rl.on("close", () => {
			console.log("Exiting.");
			connection.end();
			process.exit(0);
		});
	} catch (error) {
		console.error("Error:", error);
		connection.end();
		process.exit(1);
	}
}

main();

// fetchBooks();

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
