import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../userContext.js";
import { useNavigate, Link } from "react-router-dom";
import LibraryPage from "../components/LibraryPage/LibraryPage";
import EditLibrary from "../components/EditLibrary/EditLibrary";
import Countdown from "../components/Countdown/Countdown.jsx";
import AppOffline from "../components/AppOffline/AppOffline";
import styles from "../css/SquigglyLine.module.css";
import axios from "axios";

const Library = () => {
	const { user, setUser } = useContext(UserContext);
	const navigate = useNavigate();
	const [isEditing, setIsEditing] = useState(false);
	const [libraryData, setLibraryData] = useState({
		Fave_Books: new Set(),
		Wish_List: new Set(),
	});
	const [bookmateStatus, setBookmateStatus] = useState(false);
	const [startTime, setStartTime] = useState(null);
	const [deadLine, setDeadLine] = useState(null);
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
		if (!user) navigate("/login");

		const fetchLibraryData = async () => {
			try {
				const libraryResponse = await axios.get(
					`${nodeURL}library?LibID=${user.LibID}`
				);
				const libraryData = libraryResponse.data;
				const Fave_Books = new Set(libraryData.Fave_Books || []);
				const Wish_List = new Set(libraryData.Wish_List || []);
				const Answers = libraryData.Answers || "";
				setLibraryData({ Fave_Books, Wish_List, Answers });

				const updatedUser = { ...user, library: libraryData };
				setUser(updatedUser);
			} catch (error) {
				console.error("Error fetching library details:", error.message);
			}
		};

		if (user && !user.library) {
			fetchLibraryData();
		} else if (user) {
			const Fave_Books = new Set(user.library.Fave_Books || []);
			const Wish_List = new Set(user.library.Wish_List || []);
			const Answers = user.library.Answers || "";
			setLibraryData({ Fave_Books, Wish_List, Answers });
		} else {
			navigate("/login");
		}
	}, [user, navigate, setUser]);

	const handleButtonClick = async () => {
		setIsEditing(!isEditing);
		if (isEditing) {
			const updateData = {
				LibID: user.LibID,
				Fave_Books: Array.from(libraryData.Fave_Books),
				Wish_List: Array.from(libraryData.Wish_List),
			};

			try {
				await axios.post(`${nodeURL}update-library`, updateData);

				const updatedUser = {
					...user,
					library: {
						Fave_Books: Array.from(libraryData.Fave_Books),
						Wish_List: Array.from(libraryData.Wish_List),
					},
				};
				setUser(updatedUser);
			} catch (error) {
				console.error("Error updating library data:", error.message);
			}
		}
	};

	return (
		<>
			{bookmateStatus === 0 ? (
				<AppOffline />
			) : (
				<div
					className={`bg-primary mx-auto flex flex-col items-center justify-center ${styles.box} mb-8`}
				>
					{bookmateStatus === 1 && (
						<div className="flex flex-col  justify-center align-middle margin-auto overflow-hidden">
							<h1 className="text-4xl text-secondary font-poppins font-bold my-3 text-center">
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
						<div className="flex flex-col  justify-center align-middle margin-auto overflow-hidden">
							<h1 className="text-4xl text-secondary font-poppins font-bold my-3 text-center">
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
						<div className="flex flex-col justify-center align-middle margin-auto overflow-hidden">
							<h1 className="text-4xl text-secondary font-poppins font-bold my-3 text-center">
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
					<div className="flex flex-col justify-center align-middle margin-auto overflow-hidden">
						<h1 className="text-4xl text-secondary font-poppins font-bold mt-6 text-center">
							Library Page
						</h1>
						<div className="m-auto">
							<button
								className="btn btn-secondary m-3 font-poppins "
								onClick={handleButtonClick}
							>
								{isEditing ? "Save Changes" : "Edit Library"}
							</button>
						</div>

						{isEditing ? (
							<EditLibrary
								libraryData={libraryData}
								setLibraryData={setLibraryData}
							/>
						) : (
							<LibraryPage
								libraryData={{
									Fave_Books: Array.from(libraryData.Fave_Books),
									Wish_List: Array.from(libraryData.Wish_List),
								}}
							/>
						)}
						<div className="min-h-[9vh]"></div>
					</div>
				</div>
			)}
		</>
	);
};

export default Library;
