import React from "react";
import LibraryShelf from "../LibraryShelf/LibraryShelf.jsx";

const LibraryPage = ({ libraryData }) => {
	return (
		<div className="flex flex-col items-center py-1 min-h-screen">
			<div className="w-full flex flex-col p-1 items-center justify-center">
				<h1 className="text-4xl text-secondary font-poppins font-bold my-3 text-center">
					Your Books
				</h1>
				<LibraryShelf books={libraryData.Fave_Books} editState={0} />
			</div>
			<div className="w-full flex flex-col p-1 items-center justify-center">
				<h1 className="text-4xl text-secondary font-poppins font-bold my-3 text-center">
					Your WishList
				</h1>
				<LibraryShelf books={libraryData.Wish_List} editState={0} />
			</div>
		</div>
	);
};

export default LibraryPage;
