import React from "react";
import { Link } from "react-router-dom";

const QuizStatus = ({ answersLength }) => {
	return (
		<>
			{answersLength === 20 ? (
				<div className="flex flex-col justify-center align-middle">
					<p className="text-2xl mt-2">
						You've answered the Quiz! You can review your answers before the
						matchmaking starts!
					</p>
					<div>
						<Link
							to="/quiz"
							className="btn text-l w-[120px] text-primary font-poppins"
						>
							Review the Quiz!
						</Link>
					</div>
				</div>
			) : (
				<div className="flex flex-col justify-center align-middle">
					<p className="text-2xl mt-2">
						You need to complete the Quiz before you can qualify for the
						matchmaking! You can review your answers before the matchmaking
						starts!
					</p>
					<div>
						<Link
							to="/quiz"
							className="btn text-l w-[120px] text-primary font-poppins"
						>
							Take the Quiz!
						</Link>
					</div>
				</div>
			)}
		</>
	);
};

export default QuizStatus;
