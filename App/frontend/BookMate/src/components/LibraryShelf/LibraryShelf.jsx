import React, { useEffect, useState } from "react";
import BookCard from "../BookCard/BookCard.jsx";
import BookCardInt from "../BookCardInt/BookCardInt.jsx";

const LibraryShelf = ({ books, editState, removeBook }) => {
	const [bookDetailsList, setBookDetailsList] = useState([]);

	const nodeURL = import.meta.env.VITE_NODE_URL;
	const fastAPIURL = import.meta.env.VITE_FASTAPI_URL;

	useEffect(() => {
		const fetchBookDetails = async () => {
			try {
				const fetchPromises = books.map(async (isbn) => {
					const response = await fetch(`${nodeURL}book-details/?ISBN=${isbn}`);
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
			<div className="bg-neutral p-4 rounded-box h-auto w-full max-w-[80rem] min-h-96 flex flex-col border-2 border-accent">
				<div className="flex flex-wrap justify-center">
					{bookDetailsList.length > 0 ? (
						bookDetailsList.map(({ isbn, bookDetails }) =>
							editState === 0 ? (
								<div key={isbn} className="p-2">
									<BookCard bookDetails={bookDetails} />
								</div>
							) : (
								<div key={isbn} className="p-2">
									<BookCardInt
										bookDetails={bookDetails}
										removeBook={removeBook}
									/>
								</div>
							)
						)
					) : (
						<p className="text-primary font-montserrat">
							Search for a Book or press the button for random recommendations
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default LibraryShelf;
