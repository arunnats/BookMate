import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../userContext.js";
import { useNavigate } from "react-router-dom";
import QuestionCluster from "../QuestionCluster/QuestionCluster";
import QuestionsData from "../QuestionData";

const QuizComp = ({ setStartQuiz }) => {
	const { user } = useContext(UserContext);
	const navigate = useNavigate();
	const [currentCluster, setCurrentCluster] = useState(0);
	const [answers, setAnswers] = useState({});
	const [loading, setLoading] = useState(true);

	const fetchQuizData = async () => {
		try {
			const response = await fetch(
				`http://localhost:3000/get-answers?LibID=${user.LibID}`
			);
			const data = await response.json();
			console.log(data);
			if (data.answers) {
				setAnswers(data.answers);
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

	const handleNext = () => {
		setCurrentCluster((prev) => prev + 1);
	};

	const handlePrevious = () => {
		setCurrentCluster((prev) => prev - 1);
	};

	const saveAnswers = (newAnswers) => {
		setAnswers((prev) => {
			const updatedAnswers = { ...prev, ...newAnswers };
			return updatedAnswers;
		});
	};

	const exitQuiz = () => {
		navigate("/quiz");
		setStartQuiz(false);
	};

	const handleSubmit = async () => {
		const answerString = Object.values(answers).join("");
		if (answerString.length < 20) {
			alert("Please choose an option for all questions.");
		} else {
			try {
				await fetch("http://localhost:3000/save-answers", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ LibID: user.LibID, answers: answerString }),
				});
				navigate("/quiz");
				setStartQuiz(false);
			} catch (error) {
				console.error("Error saving answers:", error.message);
			}
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<h1>Quiz</h1>
			<button onClick={exitQuiz}>Exit Quiz</button>
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
