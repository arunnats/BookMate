import React from "react";

const QuestionBlock = ({ question, onAnswerChange }) => {
	const handleChange = (e) => {
		onAnswerChange(question.id, e.target.value);
	};

	return (
		<div className="card bg-neutral w-96 shadow-xl">
			<div className="card-body">
				<h2 className="card-title">{question.question}</h2>
				{question.options.map((option, index) => (
					<div key={index} className="form-control">
						<label className="label cursor-pointer">
							<span className="label-text">{option}</span>
							<input
								type="radio"
								name={`question-${question.id}`}
								value={option}
								className="radio checked:bg-red-500"
								onChange={handleChange}
							/>
						</label>
					</div>
				))}
			</div>
		</div>
	);
};

export default QuestionBlock;
