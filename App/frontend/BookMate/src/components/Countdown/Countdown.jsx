import React, { useState, useEffect } from "react";

const Countdown = ({ targetDateTime }) => {
	const calculateTimeLeft = () => {
		const difference = +new Date(targetDateTime) - +new Date();
		let timeLeft = {};

		if (difference > 0) {
			timeLeft = {
				days: Math.floor(difference / (1000 * 60 * 60 * 24)),
				hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
				minutes: Math.floor((difference / 1000 / 60) % 60),
				seconds: Math.floor((difference / 1000) % 60),
			};
		}

		return timeLeft;
	};

	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

	useEffect(() => {
		const timer = setTimeout(() => {
			setTimeLeft(calculateTimeLeft());
		}, 1000);

		return () => clearTimeout(timer);
	});

	const { days, hours, minutes, seconds } = timeLeft;

	return (
		<div className="grid grid-flow-col gap-5 text-center auto-cols-max mx-auto">
			{days !== undefined ? (
				<>
					<div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
						<span className="countdown font-mono text-5xl">
							<span style={{ "--value": days }}>{days}</span>
						</span>
						days
					</div>
					<div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
						<span className="countdown font-mono text-5xl">
							<span style={{ "--value": hours }}>{hours}</span>
						</span>
						hours
					</div>
					<div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
						<span className="countdown font-mono text-5xl">
							<span style={{ "--value": minutes }}>{minutes}</span>
						</span>
						min
					</div>
					<div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
						<span className="countdown font-mono text-5xl">
							<span style={{ "--value": seconds }}>{seconds}</span>
						</span>
						sec
					</div>
				</>
			) : (
				<div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
					<span className="countdown font-mono text-5xl">00</span>
					seconds
				</div>
			)}
		</div>
	);
};

export default Countdown;
