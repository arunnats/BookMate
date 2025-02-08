import React from "react";

const QuestionBlock = ({ question, selectedAnswer, onAnswerChange }) => {
	const handleChange = (e) => {
		onAnswerChange(question.id, e.target.value.charAt(0));
	};

	return (
		<div className="card bg-neutral shadow-xl my-2">
			<div className="card-body">
				<h2 className="card-title text-2xl text-primary font-poppins font-bold my-1">
					{question.question}
				</h2>
				{question.options.map((option, index) => (
					<div key={index} className="form-control">
						<label className="label cursor-pointer">
							<span className="label-text text-primary font-poppins my-1">
								{option}
							</span>
							<input
								type="radio"
								name={`question-${question.id}`}
								value={option.charAt(0)}
								className="radio checked:bg-primary"
								onChange={handleChange}
								checked={selectedAnswer === option.charAt(0)}
							/>
						</label>
					</div>
				))}
			</div>
		</div>
	);
};

export default QuestionBlock;
