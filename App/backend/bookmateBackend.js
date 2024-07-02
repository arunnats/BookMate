const express = require("express");
const mysql = require("mysql2/promise");
const { OAuth2Client } = require("google-auth-library");
const { v4: uuidv4 } = require("uuid");
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

function generateLibraryId() {
	const timestamp = new Date().toISOString().slice(0, 19).replace(/[-T:]/g, "");
	const uuidPart = uuidv4().split("-")[0];
	const LibID = `LIB-${timestamp}-${uuidPart}`;
	return LibID.substring(0, 25);
}

async function findLibrary(LibID) {
	try {
		const connection = await pool.getConnection();
		const [rows] = await connection.query(
			"SELECT * FROM library WHERE LibID = ?",
			[LibID]
		);
		connection.release();

		const Lib = rows.length > 0 ? rows[0] : null;
		// console.log("Found library:", Lib);

		const wishList = Lib && Lib.Wish_List ? Lib.Wish_List.split(",") : [];
		const faveBooks = Lib && Lib.Fave_Books ? Lib.Fave_Books.split(",") : [];

		const response = {
			LibID: Lib ? Lib.LibID : null,
			Fave_Books: faveBooks,
			Wish_List: wishList,
		};

		console.log("Returning library response:", response);
		return response;
	} catch (error) {
		console.error("Error finding library:", error.message);
		throw error;
	}
}

async function findUserBySub(sub) {
	try {
		const connection = await pool.getConnection();
		const [rows] = await connection.query("SELECT * FROM users WHERE id = ?", [
			sub,
		]);
		connection.release();

		console.log("Found user:", rows.length > 0 ? rows[0] : null);

		return rows.length > 0 ? rows[0] : null;
	} catch (error) {
		console.error("Error finding user:", error.message);
		throw error;
	}
}

async function findBook(ISBN) {
	try {
		const connection = await pool.getConnection();
		const [rows] = await connection.query(
			"SELECT * FROM top_books WHERE ISBN = ?",
			[ISBN]
		);
		connection.release();

		// console.log("Found book:", rows.length > 0 ? rows[0] : null);

		return rows.length > 0 ? rows[0] : null;
	} catch (error) {
		console.error("Error finding book:", error.message);
		throw error;
	}
}

async function deleteUserById(id) {
	try {
		const connection = await pool.getConnection();

		const [rows] = await connection.query("SELECT * FROM users WHERE id = ?", [
			id,
		]);

		console.log(rows);

		const [response] = await connection.query(
			"DELETE FROM users WHERE id = ?",
			[id]
		);

		console.log(response);

		connection.release();
	} catch (error) {
		console.error("Error deleting user:", error.message);
		throw error;
	}
}

async function deleteLibraryById(id) {
	try {
		const connection = await pool.getConnection();

		const [rows] = await connection.query(
			"SELECT * FROM library WHERE LibID = ?",
			[id]
		);

		console.log(rows);

		const [response] = await connection.query(
			"DELETE FROM library WHERE LibID = ?",
			[id]
		);

		console.log(response);

		connection.release();
	} catch (error) {
		console.error("Error deleting user:", error.message);
		throw error;
	}
}

async function createUser(sub, email, given_name, family_name, picture) {
	try {
		const connection = await pool.getConnection();
		const libID = generateLibraryId();

		console.log("Creating user with ID:", sub);

		const [resultUsers] = await connection.query(
			"INSERT INTO users (id, LibID, email, first_name, last_name, picture_url) VALUES (?, ?, ?, ?, ?, ?)",
			[sub, libID, email, given_name, family_name, picture]
		);
		console.log("Inserted into users table:", resultUsers);

		const [resultLibrary] = await connection.query(
			"INSERT INTO library (LibID, id, Fave_Books, Wish_List, answers) VALUES (?, ?, NULL, NULL, NULL)",
			[libID, sub]
		);
		console.log("Inserted into library table:", resultLibrary);

		connection.release();

		const user = {
			id: sub,
			LibID: libID,
			email,
			first_name: given_name,
			last_name: family_name,
			picture_url: picture,
			created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
		};

		console.log("Created user:", user);
		return user;
	} catch (error) {
		console.error("Error creating user:", error.message);
		throw error;
	}
}

app.post("/auth/google", async (req, res) => {
	const { token } = req.body;

	try {
		console.log("Received Google Auth token:", token);

		// Verify Google ID token
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();
		console.log("Google Auth Payload:", payload);
		const { sub, email, given_name, family_name, picture } = payload;

		// Check if the user exists in the database
		let user = await findUserBySub(sub);

		if (user) {
			// User already exists, return user details
			console.log("User already exists:", user);
			res.status(200).json({ message: "User authenticated", user });
		} else {
			// User doesn't exist, create a new user in the database
			console.log("Creating new user...");
			user = await createUser(sub, email, given_name, family_name, picture);
			res.status(200).json({ message: "User created and authenticated", user });
		}
	} catch (error) {
		console.error("Error authenticating user:", error.message);
		res.status(401).json({ error: "Invalid token" });
	}
});

app.post("/delete-user", async (req, res) => {
	const { id, LibID } = req.body;
	try {
		console.log("Deleting user by id:", id, "and LibID:", LibID);

		await deleteLibraryById(LibID);
		await deleteUserById(id);

		res.status(200).json({ message: "User deleted successfully" });
	} catch (error) {
		console.error("Error deleting user:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

app.get("/library", async (req, res) => {
	const { LibID } = req.query;
	try {
		console.log("Fetching library for LibID:", LibID);
		let library = await findLibrary(LibID);
		if (library) {
			console.log("Library found:", library);
			res.json(library);
		} else {
			console.log("Library not found for LibID:", LibID);
			res.status(404).json({ error: "Library not found" });
		}
	} catch (error) {
		console.error("Error fetching library data:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

app.post("/update-library", async (req, res) => {
	const connection = await pool.getConnection();
	const { LibID, Fave_Books, Wish_List } = req.body;
	console.log("Library update data:", { LibID, Fave_Books, Wish_List });

	const Fave_Books_Str = Fave_Books.join(",");
	const Wish_List_Str = Wish_List.join(",");

	try {
		const [resultLibUpdate] = await connection.query(
			"UPDATE library SET Fave_Books = ?, Wish_List = ? WHERE LibID = ?",
			[Fave_Books_Str, Wish_List_Str, LibID]
		);
		console.log("Updated library table:", resultLibUpdate);
		res.status(200).json({ message: "Library data updated successfully" });
	} catch (error) {
		console.error("Error updating library data:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

app.post("/save-answers", async (req, res) => {
	const connection = await pool.getConnection();
	const { LibID, answers } = req.body;
	console.log("Answers update data:", { LibID, answers });

	try {
		const [resultLibUpdate] = await connection.query(
			"UPDATE library SET answers = ? WHERE LibID = ?",
			[answers, LibID]
		);
		console.log("Updated library table:", resultLibUpdate);
		res.status(200).json({ message: "Question data updated successfully" });
	} catch (error) {
		console.error("Error updating question data:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

app.get("/get-answers", async (req, res) => {
	const { LibID } = req.query;

	try {
		const connection = await pool.getConnection();

		const [rows] = await connection.query(
			"SELECT answers FROM library WHERE LibID = ?",
			[LibID]
		);
		// console.log(rows);
		connection.release();
		if (rows.length > 0) {
			res.status(200).json({ answers: rows[0].answers });
		} else {
			res.status(404).json({ error: "No answers found for this LibID" });
		}
	} catch (error) {
		console.error("Error getting question data:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

app.get("/book-details", async (req, res) => {
	const { ISBN } = req.query;
	try {
		// console.log("Fetching Book for ISBN:", ISBN);

		let book = await findBook(ISBN);
		if (book) {
			// console.log("Book found:", book);

			const result = [
				book["Book-Title"],
				book["Book-Author"],
				book["Image-URL-M"],
				book["Year-Of-Publication"],
				book["ISBN"],
			];

			res.json(result);
		} else {
			// console.log("Book not found for ISBN:", book);
			res.status(404).json({ error: "Book not found" });
		}
	} catch (error) {
		console.error("Error fetching book data:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

app.get("/search", async (req, res) => {
	// console.log("Received search request");
	const query = req.query.q;
	if (!query) {
		return res.status(400).json({ error: "Query parameter 'q' is required" });
	}

	// Check cache first
	if (cache.has(query)) {
		// console.log("Using cached results for query:", query);
		return res.json(cache.get(query));
	}

	try {
		// console.log("Executing search query:", query);
		const [results] = await pool.query(
			"SELECT `Book-Title`, `ISBN` FROM top_books WHERE `Book-Title` LIKE ? LIMIT 10",
			[`%${query}%`]
		);

		cache.set(query, results);

		console.log("Search results:", results);
		res.json(results);
	} catch (error) {
		console.error("Error executing search query:", error);
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
