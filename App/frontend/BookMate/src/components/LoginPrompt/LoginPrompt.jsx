import React from "react";
import { Link } from "react-router-dom";
import styles from "../../css/SquigglyLine.module.css";

const LoginPrompt = () => {
	return (
		<div>
			<div
				className={`bg-primary mx-auto h-[70vh] flex items-center justify-center ${styles.box}`}
			>
				<h1 className="text-white text-4xl font-bold">
					Please Login to Continue
				</h1>
				<Link to="/login" className="btn text-l text-primary font-poppins">
					Login
				</Link>
			</div>
			<div className="mx-auto h-[20vh] flex items-center justify-center"></div>
		</div>
	);
};

export default LoginPrompt;
