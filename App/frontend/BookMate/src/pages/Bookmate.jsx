import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import styles from "../css/SquigglyLine.module.css";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../userContext.js";

const BookmatePage = () => {
	const { user, setUser } = useContext(UserContext);
	const navigate = useNavigate();
	const [libraryData, setLibraryData] = useState({
		Fave_Books: new Set(),
		Wish_List: new Set(),
		Answers: "",
	});
	const [optedIn, setOptedIn] = useState(false);
	const [bookmateStatus, setBookmateStatus] = useState(false);

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
			return;
		}

		const fetchLibraryData = async () => {
			try {
				const libraryResponse = await axios.get(
					`http://localhost:3000/library?LibID=${user.LibID}`
				);
				const fetchedLibraryData = libraryResponse.data;
				console.log(fetchedLibraryData);

				// Update local state with fetched data
				const Fave_Books = new Set(fetchedLibraryData.Fave_Books || []);
				const Wish_List = new Set(fetchedLibraryData.Wish_List || []);
				const Answers = fetchedLibraryData.Answers || "";
				setLibraryData({ Fave_Books, Wish_List, Answers });

				// Update user context with fetched library data
				const updatedUser = { ...user, library: fetchedLibraryData };
				setUser(updatedUser);

				// Fetch and update opt-in status
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
						params: {
							id: user.id,
						},
					}
				);
				setOptedIn(response.data.optedIn);
			} catch (error) {
				console.error("Error fetching opt-in status:", error.message);
			}
		};

		fetchLibraryData();
	}, []);

	const isButtonDisabled = () => {
		if (!user || !user.library) {
			return true;
		}
		const { Fave_Books, Wish_List, Answers } = libraryData;
		const faveBooksLength = Fave_Books.size;
		const wishListLength = Wish_List.size;

		return Answers.length !== 20 || faveBooksLength + wishListLength <= 3;
	};

	const handleGetMatch = async () => {
		try {
			const response = await axios.post("http://localhost:3000/opt-in", {
				id: user.id,
				optStatus: !optedIn,
			});
			console.log(response.data);
			setOptedIn(!optedIn); // Update local state after successful opt-in/out
		} catch (error) {
			console.error("Error opting in for matching:", error.message);
		}
	};

	if (!user) {
		return (
			<div>
				<div
					className={`bg-primary mx-auto h-[70vh] flex items-center justify-center ${styles.box}`}
				>
					<h1 className="text-white text-4xl font-bold">
						Please Login to Continue
					</h1>
					<Link to="/login" className="btn text-l text-primary font-poppins">
						Login
					</Link>
				</div>
				<div className="mx-auto h-[20vh] flex items-center justify-center"></div>
			</div>
		);
	}

	return (
		<div>
			<div
				className={`bg-primary mx-auto min-h-[85vh] flex flex-col items-center justify-center ${styles.box}`}
			>
				{bookmateStatus ? (
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
				) : (
					<div></div>
				)}
				<div className="text-white text-center m-3 my-6">
					<h1 className="text-4xl font-bold">Hello, {user.name}</h1>
					{[...libraryData.Fave_Books, ...libraryData.Wish_List].length > 3 ? (
						<div className="flex flex-col justify-center align-middle">
							<p className="text-2xl mt-2">
								You have{" "}
								{libraryData.Fave_Books.size + libraryData.Wish_List.size} books
								in your library! The more you add, the better the accuracy of
								the match!
							</p>
							<div>
								<Link
									to="/library"
									className="btn text-l w-[120px] text-primary font-poppins"
								>
									Go to your Library!
								</Link>
							</div>
						</div>
					) : (
						<div className="flex flex-col justify-center align-middle">
							<p className="text-2xl mt-2">
								You need to have at least 4 books across your wish list and
								favourites!
							</p>
							<div>
								<Link
									to="/library"
									className="btn text-l w-[120px] text-primary font-poppins"
								>
									Go to your Library!
								</Link>
							</div>
						</div>
					)}

					{libraryData.Answers.length === 20 ? (
						<div className="flex flex-col justify-center align-middle">
							<p className="text-2xl mt-2">
								You've answered the Quiz! You can review your answers before the
								matchmaking starts!
							</p>
							<div>
								<Link
									to="/quiz"
									className="btn text-l w-[120px] text-primary font-poppins"
								>
									Review the Quiz!
								</Link>
							</div>
						</div>
					) : (
						<div className="flex flex-col justify-center align-middle">
							<p className="text-2xl mt-2">
								You need to complete the Quiz before you can qualify for the
								matchmaking! You can review your answers before the matchmaking
								starts!
							</p>
							<div>
								<Link
									to="/quiz"
									className="btn text-l w-[120px] text-primary font-poppins"
								>
									Take the Quiz!
								</Link>
							</div>
						</div>
					)}
					<button
						className="btn"
						onClick={handleGetMatch}
						disabled={isButtonDisabled()}
					>
						{optedIn ? "Opt Out of Matchmaking" : "Get Your Match!"}
					</button>
				</div>
			</div>
			<div className="mx-auto h-[20vh] flex items-center justify-center"></div>
		</div>
	);
};

export default BookmatePage;
