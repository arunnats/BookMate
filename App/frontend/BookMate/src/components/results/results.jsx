import React from "react";

const Results = ({ recommendations }) => {
	return (
		<div className="bg-neutral p-4 rounded-box h-auto w-full max-w-80 min-h-96 flex flex-col border-2 shadow-xl border-accent">
			<h2 className="text-accent font-customRoboto text-2xl mb-2 text-center">
				Results
			</h2>
			<ul className="flex-grow overflow-auto">
				{recommendations.length > 0 ? (
					recommendations.map((recommendation, index) => (
						<li key={index} className="text-white mb-1">
							{recommendation}
						</li>
					))
				) : (
					<li className=" text-accent font-customRoboto">
						Search for a movie or press the button for random recommendations
					</li>
				)}
			</ul>
		</div>
	);
};

export default Results;
