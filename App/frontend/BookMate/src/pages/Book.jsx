import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BookInfoPage from "../components/BookInfoPage/BookInfoPage";
import { useNavigate, Link } from "react-router-dom";

const Book = () => {
	const { isbn } = useParams();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [bookDetails, setBookDetails] = useState(null); // State to hold book details
	const nodeURL = import.meta.env.VITE_NODE_URL;
	const fastAPIURL = import.meta.env.VITE_FASTAPI_URL;

	useEffect(() => {
		const fetchBookData = async () => {
			setLoading(true);
			setError(null);

			try {
				const responses = await Promise.all([
					fetch(`http://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`),
					fetch(
						`http://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=details&format=json`
					),
				]);

				const [imageResponse, bookDataResponse] = responses;

				if (!imageResponse.ok || !bookDataResponse.ok) {
					throw new Error("Failed to fetch data");
				}

				const imageBlob = await imageResponse.blob();
				const bookData = await bookDataResponse.json();

				const isbnDetails = bookData[`ISBN:${isbn}`];
				const title = isbnDetails.details.title;
				const author = isbnDetails.details.authors[0].name;
				const description = isbnDetails.details.description.value;
				const pages = isbnDetails.details.number_of_pages;
				const thumbnailUrl = isbnDetails.thumbnail_url;
				const publishDate = isbnDetails.details.publish_date;
				const physicalFormat = isbnDetails.details.physical_format;
				const genres = isbnDetails.details.subjects;

				const fetchedBookDetails = {
					title: title,
					author: author,
					description: description,
					pages: pages,
					thumbnailUrl: thumbnailUrl,
					publishDate: publishDate,
					physicalFormat: physicalFormat,
					genres: genres,
					imageUrl: URL.createObjectURL(imageBlob),
				};

				setBookDetails(fetchedBookDetails);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching book data:", error);
				setError("Failed to fetch book data");
				setLoading(false);
			}
		};

		fetchBookData();
	}, [isbn]);

	if (loading)
		return (
			<div className="bg-primary min-h-[85vh] flex flex-col items-center justify-center">
				<h1 className="text-4xl font-bold text-secondary font-poppins mb-6">
					Book data unavailable
				</h1>
			</div>
		);
	if (error)
		return (
			<div className="bg-primary min-h-[85vh] flex flex-col items-center justify-center">
				<h1 className="text-4xl font-bold text-secondary font-poppins mb-6">
					Book data unavailable
				</h1>
				<div className="flex flex-row justify-center">
					<Link
						to="/recommendations"
						className="btn btn-secondary m-2 font-poppins"
					>
						Go back
					</Link>
				</div>
			</div>
		);

	return <div>{bookDetails && <BookInfoPage bookDetails={bookDetails} />}</div>;
};

export default Book;
