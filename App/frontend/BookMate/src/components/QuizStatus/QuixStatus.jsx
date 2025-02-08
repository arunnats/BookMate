import React from "react";
import { Link } from "react-router-dom";

const QuizStatus = ({ answersLength, bookmateStatus }) => {
	return (
		<div>
			{bookmateStatus === 1 && (
				<div className="text-center w-[90%] md:w-[45%] m-auto my-1">
					<h1 className="text-secondary font-poppins font-bold text-3xl">
						2) Take the Quiz
					</h1>
					{answersLength === 20 ? (
						<p className="text-xl mt-2 font-montserrat text-accent font-medium text-justify">
							You've answered the Quiz! You can review your answers before the
							matchmaking starts!
						</p>
					) : (
						<p className="text-xl mt-2 font-montserrat text-accent font-medium text-justify">
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
				<div className="text-center w-[90%] md:w-[45%] m-auto my-1">
					<h1 className="text-secondary font-poppins font-bold text-3xl">
						2) Take the Quiz
					</h1>
					{answersLength === 20 ? (
						<p className="text-xl mt-2 font-montserrat text-accent font-medium text-justify">
							You've answered the Quiz! You can review your answers before the
							matchmaking starts!
						</p>
					) : (
						<p className="text-xl mt-2 font-montserrat text-accent font-medium text-justify">
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
