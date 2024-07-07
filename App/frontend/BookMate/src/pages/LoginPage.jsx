import React, { useContext, useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { UserContext } from "../userContext";
import { useNavigate } from "react-router-dom";
import styles from "../css/SquigglyLine.module.css";
import AppOffline from "../components/AppOffline/AppOffline";

const LoginPage = () => {
	const { user, setUser } = useContext(UserContext);
	const navigate = useNavigate();
	const [bookmateStatus, setBookmateStatus] = useState(0);

	useEffect(() => {
		const bookmateStatusGetInit = async () => {
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

		bookmateStatusGetInit();
	}, []);

	useEffect(() => {
		if (user) {
			navigate("/profile");
		}
	}, [user, navigate]);

	const handleLoginSuccess = async (credentialResponse) => {
		try {
			const response = await fetch("http://localhost:3000/auth/google", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ token: credentialResponse.credential }),
			});
			const data = await response.json();

			console.log(data);

			const libraryResponse = await fetch(
				`http://localhost:3000/library?LibID=${data.user.LibID}`
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
			{bookmateStatus ? (
				<>
					<AppOffline />={" "}
				</>
			) : (
				<div className="bg-primary min-h-[80vh] flex flex-col items-center justify-center">
					<h1 className="text-4xl font-bold text-secondary font-poppins mb-6">
						Login with Gmail to use Bookmate.
					</h1>
					<GoogleLogin
						onSuccess={handleLoginSuccess}
						onError={handleLoginFailure}
						className="bg-secondary text-neutral-content p-3 rounded-lg shadow-lg"
					/>
				</div>
			)}
		</>
	);
};

export default LoginPage;
