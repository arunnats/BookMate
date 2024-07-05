import React, { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../userContext.js";
import axios from "axios";

const UserProfile = () => {
	const { user, setUser } = useContext(UserContext);
	const navigate = useNavigate();
	const [bookmateStatus, setBookmateStatus] = useState(false);

	console.log(user);

	useEffect(() => {
		const bookmateStatusGet = async () => {
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

		bookmateStatusGet();
	}, []);

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
			{bookmateStatus === 3 && user.BookmateID && (
				<div className="flex flex-col">
					<h1 className="text-3xl  text-white font-bold my-3">
						Book Mate results are out!
					</h1>
					<div>
						<Link
							to="/view-bookmate"
							className="btn text-l text-primary font-poppins"
						>
							See your bookmate!
						</Link>
					</div>
				</div>
			)}
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
