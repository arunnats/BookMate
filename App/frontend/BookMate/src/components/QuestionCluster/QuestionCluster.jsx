import React from "react";
import QuestionBlock from "../QuestionBlock/QuestionBlock";

const QuestionCluster = ({ cluster, answers, saveAnswers }) => {
	const handleAnswerChange = (questionId, answer) => {
		saveAnswers({ [questionId]: answer });
	};

	return (
		<div className="my-2">
			{cluster.questions.map((question) => (
				<QuestionBlock
					key={question.id}
					question={question}
					selectedAnswer={answers[question.id]}
					onAnswerChange={handleAnswerChange}
				/>
			))}
		</div>
	);
};

export default QuestionCluster;
