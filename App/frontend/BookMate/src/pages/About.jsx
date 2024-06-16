import React from "react";
import { GoogleLogin } from "@react-oauth/google";

const About = () => {
	const handleLoginSuccess = (credentialResponse) => {
		console.log(credentialResponse);
	};

	const handleLoginFailure = (error) => {
		console.log(error);
		console.log("Login Failed");
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
				// Handle the response from the backend
			});
	};

	return (
		<div>
			<h1>About Page</h1>
			<GoogleLogin
				onSuccess={handleLoginSuccess}
				onError={handleLoginFailure}
			/>
			;
		</div>
	);
};

export default About;
