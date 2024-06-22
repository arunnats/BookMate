import React, { useState } from "react";
import LibraryShelf from "../LibraryShelf/LibraryShelf.jsx";
import SearchBar from "../searchbar/searchBar";
import SearchResultsList from "../searchbar/searchResultsList";

const EditLibrary = ({ libraryData, setLibraryData }) => {
	const [results, setResults] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");

	const addToList = async (result) => {
		try {
			console.log(result);
			const newFaveBooks = [...libraryData.Fave_Books, result.ISBN];
			setLibraryData((prevLibraryData) => ({
				...prevLibraryData,
				Fave_Books: newFaveBooks,
			}));
		} catch (error) {
			console.error("Error adding to list:", error);
		}
	};

	return (
		<div>
			<div className="flex flex-col items-center py-8 min-h-screen">
				<h1>Edit Library</h1>
				<div className="w-full flex flex-col p-4 items-center justify-center">
					<h1 className="pb-6">Your Books</h1>
					<SearchBar
						setResults={setResults}
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
					/>
					{results && results.length > 0 && (
						<SearchResultsList results={results} onResultClick={addToList} />
					)}
					<LibraryShelf books={libraryData.Fave_Books} editState={1} />
				</div>
				<div className="w-full flex flex-col p-1 items-center justify-center">
					<h1 className="p-6">Your WishList</h1>
					<LibraryShelf books={libraryData.Wish_List} editState={1} />
				</div>
			</div>
		</div>
	);
};

export default EditLibrary;
