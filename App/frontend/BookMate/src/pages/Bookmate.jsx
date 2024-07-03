import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import styles from "../css/SquigglyLine.module.css";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../userContext.js";
import LoginPrompt from "../components/LoginPrompt/LoginPrompt.jsx";
import LibraryStatus from "../components/LibraryStatus/LibraryStatus.jsx";
import QuizStatus from "../components/QuizStatus/QuixStatus.jsx";
import BookmateActions from "../components/BookmateActions/BookmateActions.jsx";

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

		return Answers.length !== 20 || faveBooksLength + wishListLength <= 3;
	};

	const isButtonVisible = () => {
		if (!user || !user.library) {
			return false;
		}

		return bookmateStatus !== 0; // Show button only if status is not 0
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
		<div>
			<div
				className={`bg-primary mx-auto min-h-[85vh] flex flex-col items-center justify-center ${styles.box}`}
			>
				{bookmateStatus && (
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
				<div className="text-white text-center m-3 my-6">
					<h1 className="text-4xl font-bold">Hello, {user.name}</h1>
					<LibraryStatus
						faveBooksSize={libraryData.Fave_Books.size}
						wishListSize={libraryData.Wish_List.size}
					/>
					<QuizStatus answersLength={libraryData.Answers.length} />
					<BookmateActions
						optedIn={optedIn}
						handleGetMatch={handleGetMatch}
						isButtonDisabled={isButtonDisabled}
						isButtonVisible={isButtonVisible}
					/>
				</div>
			</div>
			<div className="mx-auto h-[20vh] flex items-center justify-center"></div>
		</div>
	);
};

export default BookmatePage;
