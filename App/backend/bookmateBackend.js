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

const QuestionsData = [
	{
		clusterId: 1,
		questions: [
			{
				id: 1,
				question: "Which character would you most like to meet IRL?",
				options: [
					"A) Percy Jackson from the 'Camp Half-Blood Chronicles'",
					"B) Robert Langdon from the Dan Browns books",
					"C) Atlas Corrigan from 'It Ends With Us'",
					"D) Raskolnikov from 'Crime and Punishment'",
				],
			},
			{
				id: 2,
				question: "Which book-to-movie adaptation do you enjoy the most?",
				options: [
					"A) The Lord of the Rings trilogy",
					"B) Gone Girl",
					"C) The Fault in Our Stars",
					"D) The Great Gatsby",
				],
			},
			{
				id: 3,
				question: "Which type of book dedication attracts you?",
				options: [
					"A) To the dreamers",
					"B) To the truth-seekers",
					"C) To the lovers",
					"D) To the thinkers",
				],
			},
			{
				id: 4,
				question: "What kind of movies/TV do you like to watch the most?",
				options: [
					"A) Something with magical creatures, or a different world that I can get lost in",
					"B) Something that I'll need to think about or solve. May or may not have plot twists",
					"C) Something relatable, funny, or dramatic",
					"D) Something about a real person or an event that may or may not be a documentary",
				],
			},
			{
				id: 5,
				question: "Which of the following sounds like a great getaway?",
				options: [
					"A) In a space station determining the course of your next hyperdrive destination",
					"B) Somewhere that's relaxing and where there's no drama",
					"C) A lavish hotel in a city shrouded in mystery",
					"D) A secluded cabin in the woods",
				],
			},
		],
	},
	{
		clusterId: 2,
		questions: [
			{
				id: 6,
				question: "What kind of ending do you prfer?",
				options: [
					"A) A triumphant victory like in 'The Lord of the Rings'",
					"B) An unexpected but logical conclusion like in 'Shutter Island'",
					"C) A happy ever after like in To 'All the Boys I've Loved Before'",
					"D) An open-ended finish like in 'Slaughterhouse-Five'",
				],
			},
			{
				id: 7,
				question: "What do you NOT like to read about?",
				options: [
					"A) I cannot read anything about boring, regular people. I want suspense!",
					"B) I don't like to read books with painfully obvious plots",
					"C) I really dislike happy endings. Where's the fun in that?",
					"D) I really don't like to read about magical worlds. It's just not believable to me",
				],
			},
			{
				id: 8,
				question: "Which type of narrative conflict do you prefer?",
				options: [
					"A) Character vs. supernatural",
					"B) Character vs. man",
					"C) Character vs. love",
					"D) Character vs. self",
				],
			},
			{
				id: 9,
				question: "What type of narrative style do you prefer?",
				options: [
					"A) Third-person with multiple perspectives",
					"B) First-person with unreliable narrators",
					"C) First-person with relatable voice",
					"D) Stream of consciousness",
				],
			},
			{
				id: 10,
				question: "When’s the best time to read a book?",
				options: [
					"A)Round the campfire",
					"B)In class",
					"C)On the bus",
					"D)All the time",
				],
			},
		],
	},
	{
		clusterId: 3,
		questions: [
			{
				id: 11,
				question: "Which type of character do you relate to the most?",
				options: [
					"A) The chosen one like 'Harry'",
					"B) The detective like 'Sherlock Holmes'",
					"C) The romantic like Lara Jean from To 'All the Boys I’ve Loved Before'",
					"D) The introspective thinker like Holden from 'The Catcher in the Rye'",
				],
			},
			{
				id: 12,
				question: "Which fictional general would you appoint to lead the army?",
				options: [
					"A) Erwin Smith",
					"B) Jon Snow",
					"C) Aragorn",
					"D) Wilhuff Tarkin",
				],
			},
			{
				id: 13,
				question: "What kind of book do you prefer for a long read?",
				options: [
					"A) Epic fantasy series like 'The Wheel of Time'",
					"B) Complex mysteries like 'The Cuckoo’s Calling'",
					"C) Romantic sagas like 'Outlander'",
					"D) Comprehensive philosophical novels like 'Infinite Jest'",
				],
			},
			{
				id: 14,
				question: "Which kind of plot devices do you enjoy?",
				options: [
					"A) Magical artifacts or prophecies",
					"B) Red herrings and plot twists",
					"C) Meet-cutes and love triangles",
					"D) Flashbacks and inner monologues",
				],
			},
			{
				id: 15,
				question: "Which type of book setting appeals to you?",
				options: [
					"A) A magical school like in Hogwarts",
					"B) A small, creepy town like in Castle Rock",
					"C) A charming city like in Paris from Anna and the French Kiss",
					"D) An abstract or dystopian world like in The Handmaid's Tale",
				],
			},
		],
	},
	{
		clusterId: 4,
		questions: [
			{
				id: 16,
				question: "Which type of book title intrigues you?",
				options: [
					"A) Titles with magical or mythical elements like 'The Priory of the Orange Tree'",
					"B) Titles suggesting suspense and danger like The 'Girl on the Train'",
					"C) Titles hinting at love or humor like To All the Boys 'The Both Die at the End'",
					"D) Titles that are thought-provoking like A 'Brief History of Time'",
				],
			},
			{
				id: 17,
				question: "When reading, you care most about...",
				options: [
					"A) The world",
					"B) The twists",
					"C) The characters",
					"D) The dialogue",
				],
			},
			{
				id: 18,
				question: "Which time period do you prefer your books to be set in?",
				options: [
					"A) A distant past or future like in 'The Chronicles of Narnia'",
					"B) Modern day with dark undertones like in 'The Silent Patient'",
					"C) Contemporary setting like in 'Bridget Jones's Diary'",
					"D) Timeless periods like in 'Siddhartha'",
				],
			},
			{
				id: 19,
				question: "Which type of character relationships do you enjoy?",
				options: [
					"A) Allies and foes",
					"B) Suspects and detectives",
					"C) Lovers and friends",
					"D) Lovers and friends",
				],
			},
			{
				id: 20,
				question: "And lastly, what's your favorite part about reading a book?",
				options: [
					"A) I love when books make my heart beat faster",
					"B) I love when a book keeps me guessing",
					"C) I love when a book makes me laugh and cry",
					"D) I love when I can use my imagination",
				],
			},
		],
	},
];

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
		const answers = Lib && Lib.answers ? Lib.answers : "";

		const response = {
			LibID: Lib ? Lib.LibID : null,
			Fave_Books: faveBooks,
			Wish_List: wishList,
			Answers: answers,
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

app.post("/opt-in", async (req, res) => {
	const { id, optStatus } = req.body;

	try {
		console.log("Updating opt Status");

		const connection = await pool.getConnection();
		await connection.query("UPDATE users SET opted_in = ? WHERE id = ?", [
			optStatus,
			id,
		]);
		connection.release();

		res.status(200).json({ message: "Opt status updated successfully" });
	} catch (error) {
		console.error("Error updating opt status:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

app.post("/opt-status", async (req, res) => {
	const { id } = req.body;

	try {
		console.log("Getting opt Status");

		const connection = await pool.getConnection();
		const [rows] = await connection.query(
			"SELECT opted_in FROM users WHERE id = ?",
			[id]
		);
		connection.release();

		if (rows.length > 0) {
			const optStatus = rows[0].opted_in;
			res.status(200).json({ optedIn: optStatus });
		} else {
			res.status(404).json({ error: "User not found" });
		}
	} catch (error) {
		console.error("Error fetching opt status:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
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
			// console.log("Library found:", library);
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

		let answers = "";
		if (rows.length > 0) {
			answers = rows[0].answers || "";
		}

		connection.release();

		if (rows.length > 0) {
			res.status(200).json({ answers: answers });
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
