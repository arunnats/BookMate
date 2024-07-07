import React, { useContext, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { UserContext } from "../userContext";
import { useNavigate } from "react-router-dom";
import AppOffline from "../components/AppOffline/AppOffline";

const LoginPage = () => {
	const { user, setUser } = useContext(UserContext);
	const navigate = useNavigate();

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
		<div className="bg-primary min-h-[80vh]">
			<h1>Login Page</h1>
			<GoogleLogin
				onSuccess={handleLoginSuccess}
				onError={handleLoginFailure}
			/>
		</div>
	);
};

export default LoginPage;
