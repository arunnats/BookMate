import React from "react";
import BookCard from "../BookCard/BookCard";

const Results = ({ recommendations }) => {
	const bookCards = [];

	for (let i = 0; i < recommendations.length; i++) {
		const bookDetails = recommendations[i];
		bookCards.push(
			<div key={i} className="p-2">
				<BookCard bookDetails={bookDetails} />
			</div>
		);
	}

	return (
		<div className="bg-neutral p-4 rounded-box h-auto w-full max-w-[80rem] min-h-96 flex flex-col border-2 shadow-xl border-accent">
			<h2 className="text-accent font-customRoboto text-2xl mb-2 text-center">
				Results
			</h2>
			<div className="flex flex-wrap justify-center">
				{recommendations.length > 0 ? (
					bookCards
				) : (
					<p className="text-accent font-customRoboto">
						Search for a Book or press the button for random recommendations
					</p>
				)}
			</div>
		</div>
	);
};

export default Results;
