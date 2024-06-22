import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const BookCardInt = ({ bookDetails }) => {
	const [title, author, imageUrl, year, ISBN] = bookDetails;
	const imageUrlAlt = "http://covers.openlibrary.org/b/isbn/" + year + "-M.jpg";
	const handleError = (e) => {
		e.target.src = imageUrl; // Fallback image URL
	};

	return (
		<div className="card card-compact w-96 bg-base-100 shadow-xl">
			<figure>
				<img src={imageUrl} alt={title} onError={handleError} />
			</figure>
			<div className="card-body flex flex-col align-middle">
				<h2 className="card-title justify-center">{title}</h2>
				<p className="card-text">Author: {author}</p>
				<p className="card-text">Year: {year}</p>
				<p className="card-text">ISBN: {ISBN}</p>
				<div className="card-actions justify-center">
					<button className="btn btn-primary">Remove Book</button>
				</div>
			</div>
		</div>
	);
};

export default BookCardInt;
