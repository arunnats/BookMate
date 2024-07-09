import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../userContext.js";
import { useNavigate } from "react-router-dom";

const QuizLanding = ({ onStartQuiz, isQuizActive }) => {
	const { user } = useContext(UserContext);
	const navigate = useNavigate();
	const [answeredCount, setAnsweredCount] = useState(0);
	const [loading, setLoading] = useState(true);
	const nodeURL = import.meta.env.VITE_NODE_URL;
	const fastAPIURL = import.meta.env.VITE_FASTAPI_URL;

	const fetchQuizData = async () => {
		try {
			const response = await fetch(`${nodeURL}get-answers?LibID=${user.LibID}`);
			const data = await response.json();
			if (data.answers) {
				setAnsweredCount(Object.keys(data.answers).length);
			}
		} catch (error) {
			console.error("Error fetching quiz data:", error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!user) {
			navigate("/login");
		} else {
			fetchQuizData();
		}
	}, [user, navigate]);

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="relative bg-primary flex justify-center mt-1 md:mt-5">
			<div className="text-center text-neutral-content w-full overflow-hidden">
				<div className="flex flex-col items-center justify-center p-3">
					<h1 className="text-secondary font-poppins font-bold text-4xl mb-4">
						The Book Mate Quiz!
					</h1>
					{answeredCount === 0 && !isQuizActive && (
						<h3 className="text-lg text-accent font-montserrat font-medium p-1">
							Take the quiz now
						</h3>
					)}
					{answeredCount > 0 && answeredCount < 20 && !isQuizActive && (
						<h3 className="text-lg text-accent font-montserrat font-medium p-1">
							You have answered {answeredCount}/20 questions
						</h3>
					)}
					{answeredCount === 20 && !isQuizActive && (
						<h3 className="text-lg text-accent font-montserrat font-medium p-1">
							You have answered all the questions, you can change the answers
						</h3>
					)}
					<button
						onClick={onStartQuiz}
						className="btn btn-secondary text-lg text-primary font-poppins mt-4 mb-4"
					>
						{isQuizActive ? "Exit Quiz" : "Take Quiz"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default QuizLanding;
