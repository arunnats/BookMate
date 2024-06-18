import React, { useContext, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { UserContext } from "../userContext";
import { useNavigate } from "react-router-dom";

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
			console.log(credentialResponse);
			const response = await fetch("http://localhost:3000/auth/google", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ token: credentialResponse.credential }),
			});
			const data = await response.json();
			console.log(data);
			localStorage.setItem("user", JSON.stringify(data.user));
			setUser(data.user);

			const libraryResponse = await fetch(
				`http://localhost:3000/library?LibID=${data.user.LibID}`
			);
			const libraryData = await libraryResponse.json();
			if (libraryResponse.ok) {
				const updatedUser = { ...data.user, library: libraryData };
				console.log(updatedUser);
				localStorage.setItem("user", JSON.stringify(updatedUser));
				setUser(updatedUser);
			} else {
				console.error("Failed to fetch library details", libraryData.error);
			}

			navigate("/profile");
		} catch (error) {
			console.error("Login failed", error);
		}
	};

	const handleLoginFailure = (error) => {
		console.log(error);
		console.log("Login Failed");
	};

	return (
		<div>
			<h1>Login Page</h1>
			<GoogleLogin
				onSuccess={handleLoginSuccess}
				onError={handleLoginFailure}
			/>
		</div>
	);
};

export default LoginPage;
