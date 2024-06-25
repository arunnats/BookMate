import React from "react";

const QuestionBlock = () => {
	return (
		<div>
			<div className="card bg-neutral w-96 shadow-xl">
				<div className="card-body">
					<h2 className="card-title">Question</h2>
					<div className="form-control">
						<label className="label cursor-pointer">
							<span className="label-text">Option A</span>
							<input
								type="radio"
								name="radio-10"
								className="radio checked:bg-red-500"
								defaultChecked
							/>
						</label>
					</div>
					<div className="form-control">
						<label className="label cursor-pointer">
							<span className="label-text">Option B</span>
							<input
								type="radio"
								name="radio-10"
								className="radio checked:bg-red-500"
								defaultChecked
							/>
						</label>
					</div>
					<div className="form-control">
						<label className="label cursor-pointer">
							<span className="label-text">Option C</span>
							<input
								type="radio"
								name="radio-10"
								className="radio checked:bg-red-500"
								defaultChecked
							/>
						</label>
					</div>
					<div className="form-control">
						<label className="label cursor-pointer">
							<span className="label-text">Option D</span>
							<input
								type="radio"
								name="radio-10"
								className="radio checked:bg-red-500"
								defaultChecked
							/>
						</label>
					</div>
				</div>
			</div>
		</div>
	);
};

export default QuestionBlock;
