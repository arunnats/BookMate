import React, { useContext, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { UserContext } from "../userContext.js";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
	const { user, setUser } = useContext(UserContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (user) {
			navigate("/profile");
		}
	}, [user, navigate]);

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
				navigate("/profile");
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