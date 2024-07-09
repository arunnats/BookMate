import React, { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../userContext.js";
import styles from "../../css/SquigglyLine.module.css";
import axios from "axios";
import Countdown from "../Countdown/Countdown.jsx";
import AppOffline from "../AppOffline/AppOffline";

const UserProfile = () => {
	const { user, setUser } = useContext(UserContext);
	const navigate = useNavigate();
	const [bookmateStatus, setBookmateStatus] = useState(false);
	const [startTime, setStartTime] = useState(null);
	const [deadLine, setDeadLine] = useState(null);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [confirmLogout, setConfirmLogout] = useState(false);
	const nodeURL = import.meta.env.VITE_NODE_URL;
	const fastAPIURL = import.meta.env.VITE_FASTAPI_URL;

	useEffect(() => {
		const startTimeGet = async () => {
			try {
				const response = await axios.get(`${nodeURL}get-starttime`);
				const { starttime } = response.data;
				setStartTime(starttime);
			} catch (error) {
				console.error("Error fetching start time:", error.message);
			}
		};

		const deadLineGet = async () => {
			try {
				const response = await axios.get(`${nodeURL}get-deadline`);
				const { deadline } = response.data;
				setDeadLine(deadline);
			} catch (error) {
				console.error("Error fetching deadline:", error.message);
			}
		};

		startTimeGet();
		deadLineGet();
	}, []);

	useEffect(() => {
		const bookmateStatusGet = async () => {
			try {
				const response = await axios.get(`${nodeURL}get-bookmate-status`);
				const { status } = response.data;
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
		}
	}, [user, navigate]);

	const handleLogout = () => {
		if (!confirmLogout) {
			setConfirmLogout(true);
			setConfirmDelete(false);
		} else {
			localStorage.removeItem("user");
			setUser(null);
			navigate("/");
		}
	};

	const deleteAccount = async () => {
		if (!confirmDelete) {
			setConfirmDelete(true);
			setConfirmLogout(false);
		} else {
			try {
				const userID = user.id;
				const LibID = user.LibID;

				const response = await fetch(`${nodeURL}delete-user`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ id: userID, LibID: LibID }),
				});

				localStorage.removeItem("user");
				setUser(null);
				navigate("/");
			} catch (error) {
				console.error("Delete failed", error);
			}
		}
	};

	return (
		<>
			{bookmateStatus === 0 ? (
				<AppOffline />
			) : (
				<div
					className={`bg-primary mx-auto flex flex-col items-center justify-center ${styles.box} `}
				>
					{bookmateStatus === 1 && (
						<div className="flex flex-col  justify-center align-middle margin-auto overflow-hidden ">
							<h1 className="text-2xl md:text-4xl text-secondary font-poppins font-bold my-3 text-center">
								The next round of Bookmate starts in:
							</h1>
							{startTime && <Countdown targetDateTime={startTime} />}
							<div className="flex flex-row justify-center">
								<Link
									to="/find-your-match"
									className="btn btn-secondary m-2 font-poppins"
								>
									Let's Go!
								</Link>
							</div>
						</div>
					)}
					{bookmateStatus === 2 && (
						<div className="flex flex-col 	 justify-center align-middle margin-auto overflow-hidden">
							<h1 className="text-2xl md:text-4xl text-secondary font-poppins font-bold my-3 text-center">
								Get your Bookmates in:
							</h1>
							{deadLine && <Countdown targetDateTime={deadLine} />}
							<div className="flex flex-row justify-center">
								<Link
									to="/find-your-match"
									className="btn btn-secondary m-2 font-poppins"
								>
									Let's Go!
								</Link>
							</div>
						</div>
					)}
					{bookmateStatus === 3 && user.BookmateID && (
						<div className="flex flex-col  justify-center align-middle margin-auto overflow-hidden">
							<h1 className="text-2xl md:text-4xl text-secondary font-poppins font-bold my-3 text-center">
								Book Mate results are out!
							</h1>
							<div className="flex flex-row justify-center">
								<Link
									to="/find-your-match"
									className="btn btn-secondary m-2 font-poppins"
								>
									See your bookmate!
								</Link>
							</div>
						</div>
					)}
					<h1 className="text-3xl md:text-4xl text-secondary font-poppins font-bold my-3 text-center">
						User Profile
					</h1>
					{user ? (
						<div>
							<div className="flex">
								<img
									src={user.picture_url}
									referrerPolicy="no-referrer"
									alt="Profile"
									className="w-auto h-[16vh] md:h-[20vh]"
								/>
								<div className="flex flex-col font-montserrat text-accent font-medium justify-center align-middle text-lg">
									<p>
										Name: {user.first_name} {user.last_name}
									</p>
									<p>Nickname: {user.nickname}</p>
									<p>Email: {user.email}</p>
									<p>Phone: {user.phone_num}</p>
									<p>Instagram: {user.instagram}</p>

									<br />
								</div>
							</div>
							<div className="flex flex-col font-montserrat text-accent font-medium justify-center align-middle text-lg mx-5">
								<p>
									Email visible to your Bookmate?:{" "}
									{user.email_public ? "Yes" : "No"}
								</p>

								<p>
									Phone visible to your Bookmate?:{" "}
									{user.phone_public ? "Yes" : "No"}
								</p>
								<p>
									Instagram visible to your Bookmate?:{" "}
									{user.instagram_public ? "Yes" : "No"}
								</p>
								<Link
									to="/update-profile"
									className="btn btn-secondary m-2 font-poppins "
								>
									Change preferences
								</Link>
							</div>
							<div className="flex flex-row justify-center align-middle mb-20 ">
								<button
									className="btn btn-secondary m-2 font-poppins w-[100px] md:w-[200px]"
									onClick={deleteAccount}
								>
									{confirmDelete ? "Confirm Delete?" : "Delete Account"}
								</button>
								<button
									className="btn btn-secondary m-2 font-poppins w-[100px] md:w-[200px]"
									onClick={handleLogout}
								>
									{confirmLogout ? "Confirm Logout?" : "Logout"}
								</button>
							</div>
						</div>
					) : (
						<p>User not logged in.</p>
					)}
				</div>
			)}
		</>
	);
};

export default UserProfile;
