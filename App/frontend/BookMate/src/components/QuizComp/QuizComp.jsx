import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../userContext.js";
import { useNavigate } from "react-router-dom";
import QuestionCluster from "../QuestionCluster/QuestionCluster";
import QuestionsData from "../QuestionData";

const QuizComp = () => {
	const { user, setUser } = useContext(UserContext);
	const navigate = useNavigate();
	const [currentCluster, setCurrentCluster] = useState(0);
	const [answers, setAnswers] = useState({});

	useEffect(() => {
		if (!user) {
			navigate("/login");
		}
	}, [user, navigate]);

	const handleNext = () => {
		setCurrentCluster((prev) => prev + 1);
	};

	const handlePrevious = () => {
		setCurrentCluster((prev) => prev - 1);
	};

	const saveAnswers = (newAnswers) => {
		setAnswers({ ...answers, ...newAnswers });
	};

	return (
		<div>
			<h1>Quizz</h1>
			<QuestionCluster
				cluster={QuestionsData[currentCluster]}
				saveAnswers={saveAnswers}
			/>
			<button onClick={handlePrevious} disabled={currentCluster === 0}>
				Previous
			</button>
			<button
				onClick={handleNext}
				disabled={currentCluster === QuestionsData.length - 1}
			>
				Next
			</button>
		</div>
	);
};

export default QuizComp;
