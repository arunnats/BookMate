import React from "react";

const BookmateActions = ({ optedIn, handleGetMatch, isButtonDisabled }) => {
	return (
		<div className="text-center w-[90%] md:w-[45%] m-auto my-1">
			<h1 className="text-secondary font-poppins font-bold text-3xl">
				3) Opt in!
			</h1>
			<p className="text-xl mt-2 font-montserrat text-accent font-medium text-justify">
				Once you've added books to your Library and taken the Quiz, you're all
				set! Press the button to opt in.
			</p>
			<button
				className="btn btn-secondary m-2 font-poppins"
				onClick={handleGetMatch}
				disabled={isButtonDisabled()}
			>
				{optedIn ? "Opt Out of Matchmaking" : "Get Your Match!"}
			</button>
		</div>
	);
};

export default BookmateActions;
