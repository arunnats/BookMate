import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Book = () => {
	const { isbn } = useParams();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchBookData = async () => {
			try {
				setLoading(true);
				setError(null);

				const responses = await Promise.all([
					fetch(`http://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`),
					fetch(
						`http://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=details&format=json`
					),
				]);

				const imageBlob = await responses[0];
				// const imageUrl = URL.createObjectURL(imageBlob);

				const bookData = await responses[1].json();

				console.log("Image URL:", imageBlob);
				console.log("Book Data:", bookData);

				setLoading(false);
			} catch (err) {
				console.error(err);
				setError("Failed to fetch book data");
				setLoading(false);
			}
		};

		fetchBookData();
	}, [isbn]);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>{error}</div>;

	return (
		<div>
			<h1>Book Details</h1>
		</div>
	);
};

export default Book;
