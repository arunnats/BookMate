import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const BookCard = ({ bookDetails }) => {
	const [title, author, imageUrl, year, ISBN] = bookDetails;
	const imageUrlAlt = "http://covers.openlibrary.org/b/isbn/" + year + "-M.jpg";

	const handleError = (e) => {
		e.target.src = imageUrl; // Fallback image URL
	};

	return (
		<div className="card card-compact w-[300px] bg-secondary border-2 shadow-xl border-primary">
			<figure>
				<img className="m-3" src={imageUrl} alt={title} onError={handleError} />
			</figure>
			<div className="card-body flex flex-col align-middle">
				<h2 className="card-title justify-center text-primary font-poppins">
					{title}
				</h2>
				<p className="card-text text-primary font-poppins">Author: {author}</p>
				<p className="card-text text-primary font-poppins">Year: {year}</p>
				<p className="card-text text-primary font-poppins">ISBN: {ISBN}</p>
				<div className="card-actions justify-center font-poppins">
					{/* <button className="btn btn-accent">
						<Link className="font-poppins" to={`/book/${ISBN}`}>
							View Book
						</Link>
					</button> */}
				</div>
			</div>
		</div>
	);
};

export default BookCard;
