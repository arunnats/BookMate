import React, { useEffect, useState } from "react";
import BookCard from "../BookCard/BookCard.jsx";
import BookCardInt from "../BookCardInt/BookCardInt.jsx";

const LibraryShelf = ({ books, editState, removeBook }) => {
	const [bookDetailsList, setBookDetailsList] = useState([]);

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
					return { isbn, bookDetails };
				});

				const resolvedBookDetails = await Promise.all(fetchPromises);
				setBookDetailsList(resolvedBookDetails);
			} catch (error) {
				console.error("Error fetching book details:", error.message);
			}
		};

		if (books.length > 0) {
			fetchBookDetails();
		} else {
			setBookDetailsList([]);
		}
	}, [books]);

	return (
		<div>
			<div className="carousel carousel-center max-w-[80rem] p-4 space-x-4 bg-neutral rounded-box">
				{bookDetailsList.length > 0 ? (
					bookDetailsList.map(({ isbn, bookDetails }) =>
						editState === 0 ? (
							<BookCard key={isbn} bookDetails={bookDetails} />
						) : (
							<BookCardInt
								key={isbn}
								bookDetails={bookDetails}
								removeBook={removeBook}
							/>
						)
					)
				) : (
					<p>No books available or loading...</p>
				)}
			</div>
		</div>
	);
};

export default LibraryShelf;
