import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import styles from "../css/SquigglyLine.module.css";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../userContext.js";
import LoginPrompt from "../components/LoginPrompt/LoginPrompt.jsx";
import LibraryStatus from "../components/LibraryStatus/LibraryStatus.jsx";
import QuizStatus from "../components/QuizStatus/QuixStatus.jsx";
import BookmateActions from "../components/BookmateActions/BookmateActions.jsx";
import BookMateHero from "../components/BookMateHero/BookMateHero.jsx";
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
		const bookmateStatusGetInit = async () => {
			try {
				const response = await axios.get(`${nodeURL}get-bookmate-status`);
				const { status } = response.data;
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
				const response = await axios.get(`${nodeURL}get-bookmate-status`);
				const { status } = response.data;
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
				`${nodeURL}library?LibID=${user.LibID}`
			);
			const fetchedLibraryData = libraryResponse.data;

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
			const response = await axios.post(`${nodeURL}opt-status`, null, {
				params: { id: user.id },
			});
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
			const response = await axios.post(`${nodeURL}opt-in`, {
				id: user.id,
				optStatus: !optedIn,
			});
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
			className={`bg-primary mx-auto flex flex-col items-center justify-center ${styles.box}`}
		>
			{bookmateStatus === 0 && (
				<div className="flex flex-col  justify-center align-middle margin-auto overflow-hidden">
					<h1 className="text-secondary font-poppins font-bold text-4xl text-center mt-6">
						Under Maintenance
					</h1>
					<p className="text-2xl mt-2">
						Book Mate is currently under maintenance. Please check back later.
					</p>
				</div>
			)}

			{bookmateStatus === 1 && (
				<div className="flex flex-col w-[90%] justify-center align-middle margin-auto overflow-hidden">
					<h1 className="text-secondary font-poppins font-bold text-4xl text-center mt-6">
						The next round of Bookmate starts in:
					</h1>
					{startTime && <Countdown targetDateTime={startTime} />}
					<h1 className="text-secondary font-poppins font-bold text-4xl text-center mt-6">
						Find your match!
					</h1>
					<BookMateHero />

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
					<div className="min-h-[8svh]"></div>
				</div>
			)}

			{bookmateStatus === 2 && (
				<div className="flex flex-col justify-center align-middle margin-auto  ">
					<h1 className="text-4xl text-secondary font-poppins font-bold my-3 text-center">
						Get your Bookmates in:
					</h1>
					{deadLine && <Countdown targetDateTime={deadLine} />}
					<h1 className="text-secondary font-poppins font-bold text-4xl text-center mt-6">
						Find your match!
					</h1>
					<BookMateHero />

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
					<div className="min-h-[8vh]"></div>
				</div>
			)}

			{bookmateStatus === 3 && (
				<div className="flex flex-col  justify-center align-middle margin-auto overflow-hidden min-h-[100vh]">
					<h1 className="text-secondary font-poppins font-bold text-4xl text-center mt-6">
						Book Mate results are out!
					</h1>
					<div className="mx-auto">
						<Link
							to="/view-bookmate"
							className="btn btn-secondary m-2 font-poppins"
						>
							See your bookmate!
						</Link>
					</div>
					<h1 className="text-secondary font-poppins font-bold text-4xl text-center mt-6">
						Find your match!
					</h1>
					<BookMateHero />

					<LibraryStatus
						faveBooksSize={libraryData.Fave_Books.size}
						wishListSize={libraryData.Wish_List.size}
						bookmateStatus={bookmateStatus}
					/>
					<div className="h-[8vh]"></div>
				</div>
			)}
		</div>
	);
};

export default BookmatePage;
