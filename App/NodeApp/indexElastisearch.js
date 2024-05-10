const express = require("express");
const mysql = require("mysql2/promise");
const { Client } = require("@elastic/elasticsearch");
const fs = require("fs");

const app = express();
app.use(express.json());

const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "nats",
	database: "bookmate",
});

const esClient = new Client({
	node: "https://localhost:9200",
	auth: {
		username: "elastic",
		password: "aOhRGR8+Z9TwGs_x-7_C",
	},
	tls: {
		ca: fs.readFileSync("./cert.crt"),
		rejectUnauthorized: false,
	},
});

async function createElasticsearchIndex() {
	try {
		const conn = await connection;
		const [results] = await conn.query("SELECT * FROM book");
		const body = results.flatMap((doc) => [
			{ index: { _index: "books", _id: doc.id } },
			doc,
		]);
		await esClient.bulk({ refresh: true, body });
	} catch (error) {
		console.error(error);
	}
}

async function searchBooks(query) {
	try {
		const { body } = await esClient.search({
			index: "books",
			body: {
				query: {
					match: {
						title: query,
					},
				},
			},
		});

		// Log the entire response body to inspect its structure
		console.log("Elasticsearch Response:", body);

		// Check if the hits property exists in the response
		if (body && body.hits && body.hits.hits) {
			return body.hits.hits.map((hit) => hit._source.title);
		} else {
			console.error("Invalid Elasticsearch response:", body);
			return [];
		}
	} catch (error) {
		console.error("Error executing Elasticsearch search:", error);
		return [];
	}
}

async function main() {
	try {
		console.log("Creating Elasticsearch Index");
		await createElasticsearchIndex();
		console.log("Searching");
		const matches = await searchBooks("percy jackson and the");
		console.log("Matching titles:", matches.slice(0, 10));
	} catch (error) {
		console.error("Error:", error);
	}
}

main();

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
