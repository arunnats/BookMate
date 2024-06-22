import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../userContext.js";
import { useNavigate } from "react-router-dom";
import LibraryPage from "../components/LibraryPage/LibraryPage";
import EditLibrary from "../components/EditLibrary/EditLibrary";
import axios from "axios";

const Library = () => {
	const { user } = useContext(UserContext);
	const navigate = useNavigate();
	const [isEditing, setIsEditing] = useState(false);
	const [libraryData, setLibraryData] = useState({
		Fave_Books: new Set(),
		Wish_List: new Set(),
	});

	useEffect(() => {
		console.log("useEffect called");
		console.log("Current user:", user);

		if (user) {
			console.log("User is logged in, fetching library details");
			try {
				const Fave_Books = new Set(user.library?.Fave_Books || []);
				const Wish_List = new Set(user.library?.Wish_list || []);

				setLibraryData({ Fave_Books, Wish_List });

				// console.log("Favorite Books:", Fave_Books);
				// console.log("Wish List:", Wish_List);
			} catch (error) {
				console.error("Error fetching library details:", error.message);
				// Handle error state
			}
		} else {
			console.log("Not logged in");
			navigate("/login");
		}
	}, [user, navigate]);

	const handleButtonClick = async () => {
		setIsEditing(!isEditing);
		if (isEditing) {
			const updateData = {
				LibID: user.LibID,
				Fave_Books: Array.from(libraryData.Fave_Books),
				Wish_List: Array.from(libraryData.Wish_List),
			};
			try {
				const response = await axios.post(
					"http://localhost:3000/update-library",
					updateData
				);
				console.log(response.data);
			} catch (error) {
				console.error("Error updating library data:", error.message);
			}
		}
	};

	return (
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
	);
};

export default Library;
