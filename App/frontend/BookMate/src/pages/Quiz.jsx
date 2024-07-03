import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../userContext.js";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import QuizComp from "../components/QuizComp/QuizComp";
import QuizLanding from "../components/QuizLanding/QuizLanding";

const Quiz = () => {
	const { user } = useContext(UserContext);
	const navigate = useNavigate();
	const [startQuiz, setStartQuiz] = useState(false);
	const [bookmateStatus, setBookmateStatus] = useState(false);

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
			{bookmateStatus ? (
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
			) : (
				<div></div>
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
