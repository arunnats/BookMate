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

	const deleteAccount = async () => {
		try {
			const userID = user.id;
			const LibID = user.LibID;
			console.log(LibID);

			const response = await fetch("http://localhost:3000/delete-user", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id: userID, LibID: LibID }),
			});

			console.log(response);

			localStorage.removeItem("user");
			setUser(null);
			navigate("/");
		} catch (error) {
			console.error("Delete failed", error);
		}
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
					<button className="btn btn-primary" onClick={deleteAccount}>
						Delete Account
					</button>
					<button className="btn btn-primary" onClick={handleLogout}>
						Logout
					</button>
				</div>
			) : (
				<p>User not logged in.</p>
			)}
		</div>
	);
};

export default UserProfile;
