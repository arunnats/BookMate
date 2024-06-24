import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../userContext.js";
import { useNavigate } from "react-router-dom";
import QuizComp from "../components/QuizComp/QuizComp";

const Quiz = () => {
	const { user } = useContext(UserContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate("/login");
		}
	}, [user, navigate]);

	return (
		<div>
			<h1>Take the Quiz</h1>
			<QuizComp />
		</div>
	);
};

export default Quiz;
