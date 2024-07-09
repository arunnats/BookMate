import React, { useContext, useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { UserContext } from "../userContext";
import { useNavigate } from "react-router-dom";
import styles from "../css/SquigglyLine.module.css";
import axios from "axios";
import AppOffline from "../components/AppOffline/AppOffline";

const LoginPage = () => {
	const { user, setUser } = useContext(UserContext);
	const navigate = useNavigate();
	const [bookmateStatus, setBookmateStatus] = useState(0);
	const nodeURL = import.meta.env.VITE_NODE_URL;
	const fastAPIURL = import.meta.env.VITE_FASTAPI_URL;

	useEffect(() => {
		const bookmateStatusGetInit = async () => {
			try {
				const response = await axios.get(`${nodeURL}get-bookmate-status`);
				const { status } = response.data;
				setBookmateStatus(status);
			} catch (error) {
				console.error("Error fetching bookmate status:", error.message);
			}
		};

		bookmateStatusGetInit();
	}, []);

	useEffect(() => {
		if (user) {
			navigate("/profile");
		}
	}, [user, navigate]);

	const handleLoginSuccess = async (credentialResponse) => {
		try {
			const response = await fetch(`${nodeURL}auth/google`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ token: credentialResponse.credential }),
			});
			const data = await response.json();

			const libraryResponse = await fetch(
				`${nodeURL}library?LibID=${data.user.LibID}`
			);
			const libraryData = await libraryResponse.json();

			const updatedUser = { ...data.user, library: libraryData };
			setUser(updatedUser);

			navigate("/profile");
		} catch (error) {
			console.error("Login failed", error);
		}
	};

	const handleLoginFailure = (error) => {
		console.error("Login Failed", error);
	};

	return (
		<>
			<div className="bg-primary min-h-[80vh] flex flex-col items-center justify-center">
				<h1 className="text-3xl xl:text-4xl 2xl:text-5xl text-center font-bold text-secondary font-poppins mb-6 mx-5">
					Login with Gmail to use Bookmate.
				</h1>
				<GoogleLogin
					onSuccess={handleLoginSuccess}
					onError={handleLoginFailure}
					className="bg-secondary text-neutral-content p-3 rounded-lg shadow-lg"
				/>
			</div>
		</>
	);
};

export default LoginPage;
