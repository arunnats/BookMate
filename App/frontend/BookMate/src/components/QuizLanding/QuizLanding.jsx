import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../userContext.js";
import { useNavigate } from "react-router-dom";

const QuizLanding = ({ onStartQuiz }) => {
	const { user } = useContext(UserContext);
	const navigate = useNavigate();
	const [answeredCount, setAnsweredCount] = useState(0);
	const [loading, setLoading] = useState(true);

	const fetchQuizData = async () => {
		try {
			const response = await fetch(
				`http://localhost:3000/get-answers?LibID=${user.LibID}`
			);
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
		<div className="relative bg-primary flex  justify-center min-h-screen my-10">
			<div className="text-center text-neutral-content w-full overflow-hidden">
				<div className="flex flex-row m-auto p-3">
					<div className="flex flex-col items-center justify-center">
						<h1 className="text-secondary font-poppins font-bold text-4xl">
							Quiz
						</h1>
						{answeredCount === 0 && (
							<h3 className="text-lg text-accent font-montserrat font-medium p-1">
								Take the quiz now
							</h3>
						)}
						{answeredCount > 0 && answeredCount < 20 && (
							<h3 className="text-lg text-accent font-montserrat font-medium p-1">
								You have answered {answeredCount}/20 questions
							</h3>
						)}
						{answeredCount === 20 && (
							<h3 className="text-lg text-accent font-montserrat font-medium p-1">
								You have answered all the questions, you can change the answers
							</h3>
						)}
						<button
							onClick={onStartQuiz}
							className="btn text-l text-primary font-poppins mt-4"
						>
							Take Quiz
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default QuizLanding;
