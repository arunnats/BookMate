import React, { useContext, useEffect } from "react";
import { UserContext } from "../userContext";
import LibraryShelf from "../components/LibraryShelf/LibraryShelf";

const LibraryPage = () => {
	const { user, updateUser } = useContext(UserContext);

	useEffect(() => {
		fetchLibraryDetails();
	}, [user?.LibID, updateUser]);

	return (
		<div className="flex flex-col items-center py-8 min-h-screen">
			<h1 className="text-center">Library Page</h1>
			<br />
			<div className="w-full flex flex-col p-4 items-center justify-center">
				<h1 className="pb-6">Your Books</h1>
				<LibraryShelf />
			</div>
			<div className="w-full flex flex-col p-1 items-center justify-center">
				<h1 className="p-6">Your WishList</h1>
				<LibraryShelf />
			</div>
		</div>
	);
};

export default LibraryPage;
