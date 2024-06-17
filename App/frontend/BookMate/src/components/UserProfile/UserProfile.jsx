import React, { useContext } from "react";
import { UserContext } from "../../userContext.js";

const UserProfile = () => {
	const { user } = useContext(UserContext);

	return (
		<div>
			<h2>User Profile</h2>
			{user ? (
				<div>
					<p>
						Name: {user.first_name} {user.last_name}
					</p>
					<p>Email: {user.email}</p>
					<img src={user.picture} alt="Profile" />
				</div>
			) : (
				<p>User not logged in.</p>
			)}
		</div>
	);
};

export default UserProfile;
