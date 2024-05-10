const express = require("express");
const mysql = require("mysql2/promise");
const Fuse = require("fuse.js");
const { Cookie } = require("express-session");

const app = express();
app.use(express.json());

const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "nats",
	database: "bookmate",
});

async function createFuseIndex() {
	try {
		const conn = await connection;
		const [results] = await conn.query("SELECT title FROM book");
		const fuse = new Fuse(results, {
			keys: ["title"],
			includeScore: true,
		});
		return fuse;
	} catch (error) {
		console.error(error);
	}
}

async function fetchBooks() {
	try {
		const conn = await connection;
		const [results, fields] = await conn.query("SELECT * FROM book LIMIT 10");
		console.log(results);
		console.log(fields);
	} catch (error) {
		console.log(error);
	}
}

async function fuzzySearch(query, fuse) {
	try {
		const searchResults = fuse.search(query);
		return searchResults.map((result) => result.item.title);
	} catch (error) {
		throw error;
	}
}

async function main() {
	try {
		const fuse = await createFuseIndex();
		const matches = await fuzzySearch("harry potter and the prisoner", fuse);
		matches.slice(0, 50);
		console.log("Matching titles:", matches);
		connection.end();
	} catch (error) {
		console.error("Error:", error);
	}
}

main();

// fetchBooks();

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
