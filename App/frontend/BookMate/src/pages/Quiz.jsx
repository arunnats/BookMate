import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../userContext.js";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import QuizComp from "../components/QuizComp/QuizComp";
import QuizLanding from "../components/QuizLanding/QuizLanding";
import Countdown from "../components/Countdown/Countdown.jsx";

const Quiz = () => {
	const { user } = useContext(UserContext);
	const navigate = useNavigate();
	const [startQuiz, setStartQuiz] = useState(false);
	const [bookmateStatus, setBookmateStatus] = useState(false);
	const [startTime, setStartTime] = useState(null);
	const [deadLine, setDeadLine] = useState(null);

	useEffect(() => {
		const startTimeGet = async () => {
			try {
				const response = await axios.get("http://localhost:3000/get-starttime");
				const { starttime } = response.data;
				setStartTime(starttime);
				console.log(starttime);
			} catch (error) {
				console.error("Error fetching start time:", error.message);
			}
		};

		const deadLineGet = async () => {
			try {
				const response = await axios.get("http://localhost:3000/get-deadline");
				const { deadline } = response.data;
				setDeadLine(deadline);
				console.log(deadline);
			} catch (error) {
				console.error("Error fetching deadline:", error.message);
			}
		};

		startTimeGet();
		deadLineGet();
	}, []);

	useEffect(() => {
		const bookmateStatusGet = async () => {
			try {
				const response = await axios.get(
					"http://localhost:3000/get-bookmate-status"
				);
				const { status } = response.data;
				console.log(status);
				setBookmateStatus(status);
			} catch (error) {
				console.error("Error fetching bookmate status:", error.message);
			}
		};

		bookmateStatusGet();
	}, []);

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
			{bookmateStatus === 1 && (
				<div className="flex flex-col">
					<h1 className="text-3xl  text-white font-bold my-3">
						The next round of Bookmate starts in:
					</h1>
					{startTime && <Countdown targetDateTime={startTime} />}
					<div>
						<Link
							to="/find-your-match"
							className="btn text-l text-primary font-poppins"
						>
							Let's Go!
						</Link>
					</div>
				</div>
			)}
			{bookmateStatus === 2 && (
				<div className="flex flex-col">
					<h1 className="text-3xl  text-white font-bold my-3">
						The next round of Bookmate starts in:
					</h1>
					{startTime && <Countdown targetDateTime={deadLine} />}
					<div>
						<Link
							to="/find-your-match"
							className="btn text-l text-primary font-poppins"
						>
							Let's Go!
						</Link>
					</div>
				</div>
			)}
			{bookmateStatus === 3 && user.BookmateID && (
				<div className="flex flex-col">
					<h1 className="text-3xl  text-white font-bold my-3">
						Book Mate results are out!
					</h1>
					<div>
						<Link
							to="/view-bookmate"
							className="btn text-l text-primary font-poppins"
						>
							See your bookmate!
						</Link>
					</div>
				</div>
			)}
			{startQuiz ? (
				<QuizComp setStartQuiz={setStartQuiz} />
			) : (
				<QuizLanding onStartQuiz={handleStartQuiz} />
			)}
		</div>
	);
};

export default Quiz;
