import React from "react";
import QuestionBlock from "../QuestionBlock/QuestionBlock";

const QuestionCluster = ({ cluster, saveAnswers }) => {
	const handleAnswerChange = (questionId, answer) => {
		saveAnswers({ [questionId]: answer });
	};

	return (
		<div>
			{cluster.questions.map((question) => (
				<QuestionBlock
					key={question.id}
					question={question}
					onAnswerChange={handleAnswerChange}
				/>
			))}
		</div>
	);
};

export default QuestionCluster;
