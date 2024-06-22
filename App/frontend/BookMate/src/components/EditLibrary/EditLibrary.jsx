import React, { useState } from "react";
import LibraryShelf from "../LibraryShelf/LibraryShelf.jsx";
import SearchBar from "../searchbar/searchBar";
import SearchResultsList from "../searchbar/searchResultsList";

const EditLibrary = ({ libraryData, setLibraryData }) => {
	const [faveResults, setFaveResults] = useState([]);
	const [wishResults, setWishResults] = useState([]);
	const [faveSearchTerm, setFaveSearchTerm] = useState("");
	const [wishSearchTerm, setWishSearchTerm] = useState("");

	const addToFaveBooks = (result) => {
		const newFaveBooks = new Set(libraryData.Fave_Books);
		newFaveBooks.add(result.ISBN);
		setLibraryData((prevLibraryData) => ({
			...prevLibraryData,
			Fave_Books: newFaveBooks,
		}));
	};

	const addToWishList = (result) => {
		const newWishList = new Set(libraryData.Wish_List);
		newWishList.add(result.ISBN);
		setLibraryData((prevLibraryData) => ({
			...prevLibraryData,
			Wish_List: newWishList,
		}));
	};

	const removeFaveBook = (isbn) => {
		const newFaveBooks = new Set(libraryData.Fave_Books);
		newFaveBooks.delete(isbn);
		setLibraryData((prevLibraryData) => ({
			...prevLibraryData,
			Fave_Books: newFaveBooks,
		}));
	};

	const removeWishBook = (isbn) => {
		const newWishList = new Set(libraryData.Wish_List);
		newWishList.delete(isbn);
		setLibraryData((prevLibraryData) => ({
			...prevLibraryData,
			Wish_List: newWishList,
		}));
	};

	return (
		<div>
			<div className="flex flex-col items-center py-8 min-h-screen">
				<h1>Edit Library</h1>
				<div className="w-full flex flex-col p-4 items-center justify-center">
					<h1 className="pb-6">Your Books</h1>
					<SearchBar
						setResults={setFaveResults}
						searchTerm={faveSearchTerm}
						setSearchTerm={setFaveSearchTerm}
					/>
					{faveResults && faveResults.length > 0 && (
						<SearchResultsList
							results={faveResults}
							onResultClick={addToFaveBooks}
						/>
					)}
					<br />
					<LibraryShelf
						books={Array.from(libraryData.Fave_Books)}
						editState={1}
						removeBook={removeFaveBook}
					/>
				</div>
				<div className="w-full flex flex-col p-1 items-center justify-center">
					<h1 className="p-6">Your WishList</h1>
					<SearchBar
						setResults={setWishResults}
						searchTerm={wishSearchTerm}
						setSearchTerm={setWishSearchTerm}
					/>
					{wishResults && wishResults.length > 0 && (
						<SearchResultsList
							results={wishResults}
							onResultClick={addToWishList}
						/>
					)}
					<br />
					<LibraryShelf
						books={Array.from(libraryData.Wish_List)}
						editState={1}
						removeBook={removeWishBook}
					/>
				</div>
			</div>
		</div>
	);
};

export default EditLibrary;
