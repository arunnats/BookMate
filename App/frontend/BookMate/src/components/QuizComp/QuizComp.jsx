import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuestionBlock from "../QuestionBlock/QuestionBlock";

const QuizComp = () => {
	return (
		<div>
			<h1>Quizz</h1>
			<QuestionBlock />
		</div>
	);
};

export default QuizComp;
