import React from "react";
import { Link } from "react-router-dom";

const QuizStatus = ({ answersLength, bookmateStatus }) => {
	return (
		<div>
			{bookmateStatus === 1 && (
				<div className="flex flex-col justify-center align-middle">
					{answersLength === 20 ? (
						<p className="text-2xl mt-2 text-secondary font-poppins">
							You've answered the Quiz! You can review your answers before the
							matchmaking starts!
						</p>
					) : (
						<p className="text-2xl mt-2 text-white">
							You can take the Quiz to get your match!
						</p>
					)}
					<div className="mx-auto">
						<Link to="/quiz" className="btn btn-secondary m-2 font-poppins">
							Go to the Quiz!
						</Link>
					</div>
				</div>
			)}
			{bookmateStatus === 2 && (
				<div className="flex flex-col justify-center align-middle">
					{answersLength === 20 ? (
						<p className="text-2xl mt-2 text-white">
							You've answered the Quiz! You can review your answers before the
							matchmaking starts!
						</p>
					) : (
						<p className="text-2xl mt-2 text-white">
							You can take the Quiz to get your match!
						</p>
					)}
					<div className="mx-auto">
						<Link to="/quiz" className="btn btn-secondary m-2 font-poppins">
							Go to the Quiz!
						</Link>
					</div>
				</div>
			)}
		</div>
	);
};

export default QuizStatus;
