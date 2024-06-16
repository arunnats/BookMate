const express = require("express");
const mysql = require("mysql2/promise");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

const app = express();
app.use(express.json());
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const pool = mysql.createPool({
	host: "localhost",
	user: "root",
	password: "nats",
	database: "bookmate",
	waitForConnections: true,
	connectionLimit: 100,
	queueLimit: 0,
});

const cache = new Map();

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");
	next();
});

async function findUserBySub(sub) {
	try {
		const connection = await pool.getConnection();
		const [rows] = await connection.query("SELECT * FROM users WHERE id = ?", [
			sub,
		]);
		connection.release();

		return rows.length > 0 ? rows[0] : null;
	} catch (error) {
		console.error("Error finding user:", error.message);
		throw error;
	}
}

// Function to create a new user in MySQL database
async function createUser(sub, email, given_name, family_name, picture) {
	try {
		const connection = await pool.getConnection();
		const [result] = await connection.query(
			"INSERT INTO users (id, email, first_name, last_name, picture_url) VALUES (?, ?, ?, ?, ?)",
			[sub, email, given_name, family_name, picture]
		);
		connection.release();

		return {
			id: sub,
			email,
			first_name: given_name,
			last_name: family_name,
			picture_url: picture,
			created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
		};
	} catch (error) {
		console.error("Error creating user:", error.message);
		throw error;
	}
}

app.post("/auth/google", async (req, res) => {
	const { token } = req.body;

	try {
		// Verify Google ID token
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();
		console.log(payload);
		const { sub, email, given_name, family_name, picture } = payload;

		// Check if the user exists in the database
		let user = await findUserBySub(sub);

		if (user) {
			// User already exists, return user details
			res.status(200).json({ message: "User authenticated", user });
		} else {
			// User doesn't exist, create a new user in the database
			user = await createUser(sub, email, given_name, family_name, picture);
			res.status(200).json({ message: "User created and authenticated", user });
		}
	} catch (error) {
		console.error("Error authenticating user:", error.message);
		res.status(401).json({ error: "Invalid token" });
	}
});

app.get("/search", async (req, res) => {
	console.log("search req");
	const query = req.query.q;
	if (!query) {
		return res.status(400).json({ error: "Query parameter 'q' is required" });
	}

	// Check cache first
	if (cache.has(query)) {
		console.log("Using cache for query:", query);
		return res.json(cache.get(query));
	}

	try {
		const [results] = await pool.query(
			"SELECT `Book-Title`, `ISBN` FROM top_books WHERE `Book-Title` LIKE ? LIMIT 10",
			[`%${query}%`]
		);

		cache.set(query, results);

		res.json(results);
	} catch (error) {
		console.error("Error executing query", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

setInterval(() => {
	cache.clear();
	console.log("Cache cleared");
}, 1000 * 60 * 60); // clear cache every hour

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
