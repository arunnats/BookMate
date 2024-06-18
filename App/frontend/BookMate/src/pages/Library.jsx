import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../userContext";
import { useNavigate } from "react-router-dom";
import LibraryShelf from "../components/LibraryShelf/LibraryShelf";

const LibraryPage = () => {
	const { user } = useContext(UserContext);
	const navigate = useNavigate();
	const [libraryData, setLibraryData] = useState({
		Fave_Books: [],
		Wish_List: [],
	});

	useEffect(() => {
		console.log("useEffect called");
		console.log("Current user:", user);

		if (user) {
			console.log("User is logged in, fetching library details");
			try {
				const Fave_Books = user.library?.Fave_Books || [];
				const Wish_List = user.library?.Wish_list || [];

				setLibraryData({ Fave_Books, Wish_List });

				console.log("Favorite Books:", Fave_Books);
				console.log("Wish List:", Wish_List);
			} catch (error) {
				console.error("Error fetching library details:", error.message);
				// Handle error state
			}
		} else {
			console.log("Not logged in");
			navigate("/login");
		}
	}, [user, navigate]);

	return (
		<div className="flex flex-col items-center py-8 min-h-screen">
			<h1 className="text-center">Library Page</h1>
			<br />
			<div className="w-full flex flex-col p-4 items-center justify-center">
				<h1 className="pb-6">Your Books</h1>
				<LibraryShelf books={libraryData.Fave_Books} />
			</div>
			<div className="w-full flex flex-col p-1 items-center justify-center">
				<h1 className="p-6">Your WishList</h1>
				<LibraryShelf books={libraryData.Wish_List} />
			</div>
		</div>
	);
};

export default LibraryPage;
