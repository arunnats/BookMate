import React from "react";

const BookmateActions = ({
	optedIn,
	handleGetMatch,
	isButtonDisabled,
	isButtonVisible,
}) => {
	return (
		!isButtonVisible && (
			<button
				className="btn"
				onClick={handleGetMatch}
				disabled={isButtonDisabled()}
			>
				{optedIn ? "Opt Out of Matchmaking" : "Get Your Match!"}
			</button>
		)
	);
};

export default BookmateActions;
