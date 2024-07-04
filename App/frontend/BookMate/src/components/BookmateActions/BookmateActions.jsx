import React from "react";

const BookmateActions = ({ optedIn, handleGetMatch, isButtonDisabled }) => {
	return (
		<div className="mx-auto my-4">
			<button
				className="btn"
				onClick={handleGetMatch}
				disabled={isButtonDisabled()}
			>
				{optedIn ? "Opt Out of Matchmaking" : "Get Your Match!"}
			</button>
		</div>
	);
};

export default BookmateActions;
