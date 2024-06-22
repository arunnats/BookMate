import React, { useEffect, useState } from "react";
import BookCard from "../BookCard/BookCard.jsx";
import BookCardInt from "../BookCardInt/BookCardInt.jsx";

const LibraryShelf = ({ books, editState }) => {
	const [bookCards, setBookCards] = useState([]);

	useEffect(() => {
		const fetchBookDetails = async () => {
			try {
				const fetchPromises = books.map(async (isbn) => {
					const response = await fetch(
						`http://localhost:3000/book-details/?ISBN=${isbn}`
					);
					if (!response.ok) {
						throw new Error(`Failed to fetch book details for ISBN ${isbn}`);
					}
					const bookDetails = await response.json();
					if (editState === 0)
						return <BookCard key={isbn} bookDetails={bookDetails} />;
					else return <BookCardInt key={isbn} bookDetails={bookDetails} />;
				});

				const resolvedBookCards = await Promise.all(fetchPromises);
				setBookCards(resolvedBookCards);
			} catch (error) {
				console.error("Error fetching book details:", error.message);
				// Handle error state if needed
			}
		};

		if (books.length > 0) {
			fetchBookDetails();
		}
	}, [books, editState]);

	return (
		<div>
			<div className="carousel carousel-center max-w-[80rem] p-4 space-x-4 bg-neutral rounded-box">
				{bookCards.length > 0 ? (
					bookCards
				) : (
					<p>No books available or loading...</p>
				)}
			</div>
		</div>
	);
};

export default LibraryShelf;
