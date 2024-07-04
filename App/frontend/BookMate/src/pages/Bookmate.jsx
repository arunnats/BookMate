import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import styles from "../css/SquigglyLine.module.css";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../userContext.js";
import LoginPrompt from "../components/LoginPrompt/LoginPrompt.jsx";
import LibraryStatus from "../components/LibraryStatus/LibraryStatus.jsx";
import QuizStatus from "../components/QuizStatus/QuixStatus.jsx";
import BookmateActions from "../components/BookmateActions/BookmateActions.jsx";
import Countdown from "../components/Countdown/Countdown.jsx";

const BookmatePage = () => {
	const { user, setUser } = useContext(UserContext);
	const navigate = useNavigate();
	const [libraryData, setLibraryData] = useState({
		Fave_Books: new Set(),
		Wish_List: new Set(),
		Answers: "",
	});
	const [optedIn, setOptedIn] = useState(false);
	const [bookmateStatus, setBookmateStatus] = useState(0);
	const [startTime, setStartTime] = useState(null);
	const [deadLine, setDeadLine] = useState(null);

	useEffect(() => {
		const startTimeGet = async () => {
			try {
				const response = await axios.get("http://localhost:3000/get-starttime");
				const { starttime } = response.data;
				setStartTime(starttime);
				console.log(starttime);
			} catch (error) {
				console.error("Error fetching start time:", error.message);
			}
		};

		const deadLineGet = async () => {
			try {
				const response = await axios.get("http://localhost:3000/get-deadline");
				const { deadline } = response.data;
				setDeadLine(deadline);
				console.log(deadline);
			} catch (error) {
				console.error("Error fetching deadline:", error.message);
			}
		};

		startTimeGet();
		deadLineGet();
	}, []);
	useEffect(() => {
		const bookmateStatusGetInit = async () => {
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

		bookmateStatusGetInit();
	}, []);

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

		const intervalId = setInterval(bookmateStatusGet, 5000);

		return () => clearInterval(intervalId);
	}, []);

	useEffect(() => {
		if (!user) {
			navigate("/login");
		} else {
			fetchLibraryData();
		}
	}, []);

	const fetchLibraryData = async () => {
		try {
			const libraryResponse = await axios.get(
				`http://localhost:3000/library?LibID=${user.LibID}`
			);
			const fetchedLibraryData = libraryResponse.data;
			console.log(fetchedLibraryData);

			const Fave_Books = new Set(fetchedLibraryData.Fave_Books || []);
			const Wish_List = new Set(fetchedLibraryData.Wish_List || []);
			const Answers = fetchedLibraryData.Answers || "";
			setLibraryData({ Fave_Books, Wish_List, Answers });

			const updatedUser = { ...user, library: fetchedLibraryData };
			setUser(updatedUser);

			fetchOptInStatus();
		} catch (error) {
			console.error("Error fetching library details:", error.message);
		}
	};

	const fetchOptInStatus = async () => {
		try {
			const response = await axios.post(
				"http://localhost:3000/opt-status",
				null,
				{
					params: { id: user.id },
				}
			);
			setOptedIn(response.data.optedIn);
		} catch (error) {
			console.error("Error fetching opt-in status:", error.message);
		}
	};

	const isButtonDisabled = () => {
		if (!user || !user.library) {
			return true;
		}
		const { Fave_Books, Wish_List, Answers } = libraryData;
		const faveBooksLength = Fave_Books.size;
		const wishListLength = Wish_List.size;

		return Answers.length !== 20 || faveBooksLength + wishListLength < 3;
	};

	const handleGetMatch = async () => {
		try {
			const response = await axios.post("http://localhost:3000/opt-in", {
				id: user.id,
				optStatus: !optedIn,
			});
			console.log(response.data);
			setOptedIn(!optedIn);
		} catch (error) {
			console.error("Error opting in for matching:", error.message);
		}
	};

	if (!user) {
		return <LoginPrompt />;
	}

	return (
		<div
			className={`bg-primary mx-auto min-h-[85vh] flex flex-col items-center justify-center ${styles.box}`}
		>
			{bookmateStatus === 0 && (
				<div className="text-white text-center m-3 my-6">
					<h1 className="text-4xl font-bold">Under Maintenance</h1>
					<p className="text-2xl mt-2">
						Book Mate is currently under maintenance. Please check back later.
					</p>
				</div>
			)}

			{bookmateStatus === 1 && (
				<div className="flex flex-col justify-center align-middle margin-auto">
					<h1 className="text-3xl  text-white font-bold my-3">
						The next round of Bookmate starts in:
					</h1>
					{startTime && <Countdown targetDateTime={startTime} />}

					<LibraryStatus
						faveBooksSize={libraryData.Fave_Books.size}
						wishListSize={libraryData.Wish_List.size}
						bookmateStatus={bookmateStatus}
					/>
					<QuizStatus
						answersLength={libraryData.Answers.length}
						bookmateStatus={bookmateStatus}
					/>
					<BookmateActions
						optedIn={optedIn}
						handleGetMatch={handleGetMatch}
						isButtonDisabled={isButtonDisabled}
					/>
				</div>
			)}

			{bookmateStatus === 2 && (
				<div className="flex flex-col justify-center align-middle margin-auto">
					<h1 className="text-3xl  text-white font-bold my-3">
						Get your Bookmates in:
					</h1>
					{deadLine && <Countdown targetDateTime={deadLine} />}
					<LibraryStatus
						faveBooksSize={libraryData.Fave_Books.size}
						wishListSize={libraryData.Wish_List.size}
						bookmateStatus={bookmateStatus}
					/>
					<QuizStatus
						answersLength={libraryData.Answers.length}
						bookmateStatus={bookmateStatus}
					/>
					<BookmateActions
						optedIn={optedIn}
						handleGetMatch={handleGetMatch}
						isButtonDisabled={isButtonDisabled}
					/>
				</div>
			)}

			{bookmateStatus === 3 && (
				<div className="flex flex-col justify-center align-middle margin-auto">
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
					<LibraryStatus
						faveBooksSize={libraryData.Fave_Books.size}
						wishListSize={libraryData.Wish_List.size}
						bookmateStatus={bookmateStatus}
					/>
				</div>
			)}
		</div>
	);
};

export default BookmatePage;
