import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../userContext.js";
import { useNavigate } from "react-router-dom";
import QuestionCluster from "../QuestionCluster/QuestionCluster";
import QuestionsData from "../QuestionData";

const QuizComp = () => {
	const { user, setUser } = useContext(UserContext);
	const navigate = useNavigate();
	const [currentCluster, setCurrentCluster] = useState(0);
	const [answers, setAnswers] = useState(() => {
		const savedAnswers = localStorage.getItem("quizAnswers");
		return savedAnswers ? JSON.parse(savedAnswers) : {};
	});
	const LibID = user.LibID;

	const fetchUserAnswers = async (userId) => {
		const response = await fetch(
			`http://localhost:3000/get-answers?userId=${userId}`
		);
		const data = await response.json();
		return data.answers;
	};

	const saveUserAnswers = async (userId, answerString) => {
		await fetch("http://localhost:3000/save-answers", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ LibID, answers: answerString }),
		});
	};

	useEffect(() => {
		if (!user) {
			navigate("/login");
		} else {
			fetchUserAnswers(user.id).then((savedAnswers) => {
				setAnswers(savedAnswers);
				localStorage.setItem("quizAnswers", JSON.stringify(savedAnswers));
			});
		}
	}, [user, navigate]);

	const handleNext = () => {
		setCurrentCluster((prev) => prev + 1);
		localStorage.setItem("quizAnswers", JSON.stringify(answers));
	};

	const handlePrevious = () => {
		setCurrentCluster((prev) => prev - 1);
		localStorage.setItem("quizAnswers", JSON.stringify(answers));
	};

	const saveAnswers = (newAnswers) => {
		setAnswers((prev) => ({ ...prev, ...newAnswers }));
		localStorage.setItem(
			"quizAnswers",
			JSON.stringify({ ...answers, ...newAnswers })
		);
	};

	const handleSubmit = () => {
		const answerString = Object.values(answers).join("");
		if (answerString.length < 20) {
			alert("Please choose an option for all questions.");
		} else {
			console.log(answerString);
			saveUserAnswers(user.id, answerString);
			localStorage.removeItem("quizAnswers");
		}
	};

	return (
		<div>
			<h1>Quiz</h1>
			<QuestionCluster
				cluster={QuestionsData[currentCluster]}
				answers={answers}
				saveAnswers={saveAnswers}
			/>
			<button onClick={handlePrevious} disabled={currentCluster === 0}>
				Previous
			</button>
			{currentCluster === QuestionsData.length - 1 ? (
				<button onClick={handleSubmit}>Submit</button>
			) : (
				<button onClick={handleNext}>Next</button>
			)}
		</div>
	);
};

export default QuizComp;
