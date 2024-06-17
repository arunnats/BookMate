import React, { useContext, useState } from "react";
import UserProfile from "../components/UserProfile/UserProfile";

const Provider = () => {
	return (
		<div>
			<h1>Profile Page</h1>
			<UserProfile />
		</div>
	);
};

export default Provider;
