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
		<div>
			<h1>Quiz</h1>
			{answeredCount === 0 && <h3>Take the quiz now</h3>}
			{answeredCount > 0 && answeredCount < 20 && (
				<h3>You have answered {answeredCount}/20 questions</h3>
			)}
			{answeredCount === 20 && (
				<h3>You have answered all the questions, you can change the answers</h3>
			)}
			<button onClick={onStartQuiz}>Take Quiz</button>
		</div>
	);
};

export default QuizLanding;
