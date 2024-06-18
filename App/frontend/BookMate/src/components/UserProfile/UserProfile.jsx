import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../userContext.js";

const UserProfile = () => {
	const { user, setUser } = useContext(UserContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate("/login");
		} else {
			console.log("Logged in");
		}
	}, [user, navigate]);

	const handleLogout = () => {
		localStorage.removeItem("user");
		setUser(null);
		navigate("/");
	};

	return (
		<div>
			<h2>User Profile</h2>
			{user ? (
				<div>
					<p>
						<img
							src={user.picture_url}
							referrerPolicy="no-referrer"
							alt="Profile"
						/>
						Name: {user.first_name} {user.last_name}
					</p>
					<p>Email: {user.email}</p>
					<button onClick={handleLogout}>Logout</button>
				</div>
			) : (
				<p>User not logged in.</p>
			)}
		</div>
	);
};

export default UserProfile;
