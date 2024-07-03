import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../userContext.js";
import { useNavigate, Link } from "react-router-dom";
import LibraryPage from "../components/LibraryPage/LibraryPage";
import EditLibrary from "../components/EditLibrary/EditLibrary";
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
		if (!user) navigate("/login");

		const fetchLibraryData = async () => {
			try {
				const libraryResponse = await axios.get(
					`http://localhost:3000/library?LibID=${user.LibID}`
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
			console.log(user.library);
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
				await axios.post("http://localhost:3000/update-library", updateData);

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
		<div className="library-container">
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
			<div className="flex flex-col items-center py-8 min-h-screen">
				<h1 className="text-center">Library Page</h1>
				<br />
				<button className="btn btn-primary" onClick={handleButtonClick}>
					{isEditing ? "Save Changes" : "Edit Library"}
				</button>
				<br />
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
			</div>
		</div>
	);
};

export default Library;
