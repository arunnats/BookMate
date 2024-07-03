import React from "react";
import { Link } from "react-router-dom";

const QuizStatus = ({ answersLength, isButtonVisible }) => {
	return (
		<>
			{isButtonVisible ? (
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
						You can no longer take the Quiz until the next round of Bookmate.
					</p>
					<div>
						<Link
							to="/quiz"
							className="btn text-l w-[120px] text-primary font-poppins"
							disabled
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
