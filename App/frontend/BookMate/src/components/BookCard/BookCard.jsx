import React from "react";

const BookCard = ({ bookDetails }) => {
	const [title, author, imageUrl, isbn] = bookDetails;

	return (
		<div className="card card-compact w-96 bg-base-100 shadow-xl">
			<figure>
				<img src={imageUrl} alt={title} />
			</figure>
			<div className="card-body">
				<h2 className="card-title">{title}</h2>
				<p className="card-text">Author: {author}</p>
				<p className="card-text">ISBN: {isbn}</p>
				<div className="card-actions justify-end">
					<button className="btn btn-primary">More Info</button>
				</div>
			</div>
		</div>
	);
};

export default BookCard;
