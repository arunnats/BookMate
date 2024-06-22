import React from "react";
import LibraryShelf from "../LibraryShelf/LibraryShelf.jsx";

const LibraryPage = ({ libraryData }) => {
	return (
		<div className="flex flex-col items-center py-8 min-h-screen">
			<div className="w-full flex flex-col p-4 items-center justify-center">
				<h1 className="pb-6">Your Books</h1>
				<LibraryShelf books={libraryData.Fave_Books} editState={0} />
			</div>
			<div className="w-full flex flex-col p-1 items-center justify-center">
				<h1 className="p-6">Your WishList</h1>
				<LibraryShelf books={libraryData.Wish_List} editState={0} />
			</div>
		</div>
	);
};

export default LibraryPage;
