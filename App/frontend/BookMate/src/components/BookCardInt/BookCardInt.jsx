import React, { useEffect } from "react";

const BookCardInt = ({ bookDetails, removeBook }) => {
	const [title, author, imageUrl, year, ISBN] = bookDetails;
	const imageUrlAlt = "http://covers.openlibrary.org/b/isbn/" + year + "-M.jpg";
	const handleError = (e) => {
		e.target.src = imageUrlAlt; // Fallback image URL
	};

	return (
		<div className="card card-compact w-[300px] bg-secondary border-2 shadow-xl border-primary m-2">
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
				<div className="card-actions justify-center text-primary font-poppins">
					<button
						className="btn btn-accent font-poppins"
						onClick={() => removeBook(ISBN)}
					>
						Remove Book
					</button>
				</div>
			</div>
		</div>
	);
};

export default BookCardInt;
