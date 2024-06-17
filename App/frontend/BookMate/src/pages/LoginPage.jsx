import React, { useContext, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { UserContext } from "../userContext.js";

const LoginPage = () => {
	const { setUser } = useContext(UserContext);

	const handleLoginSuccess = (credentialResponse) => {
		console.log(credentialResponse);
		fetch("http://localhost:3000/auth/google", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ token: credentialResponse.credential }),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				localStorage.setItem("user", JSON.stringify(data.user));
				setUser(data.user);
				// Handle the response from the backend
			});
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
