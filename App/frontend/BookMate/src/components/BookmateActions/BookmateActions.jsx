import React from "react";

const BookmateActions = ({ optedIn, handleGetMatch, isButtonDisabled }) => {
	return (
		<div className="mx-auto my-4">
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
