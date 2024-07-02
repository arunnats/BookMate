import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../userContext.js";
import { useNavigate } from "react-router-dom";
import QuizComp from "../components/QuizComp/QuizComp";
import QuizLanding from "../components/QuizLanding/QuizLanding";

const Quiz = () => {
	const { user } = useContext(UserContext);
	const navigate = useNavigate();
	const [startQuiz, setStartQuiz] = useState(false);

	useEffect(() => {
		if (!user) {
			navigate("/login");
		}
	}, [user, navigate]);

	const handleStartQuiz = () => {
		setStartQuiz(true);
	};

	return (
		<div>
			{startQuiz ? (
				<QuizComp setStartQuiz={setStartQuiz} />
			) : (
				<QuizLanding onStartQuiz={handleStartQuiz} />
			)}
		</div>
	);
};

export default Quiz;
