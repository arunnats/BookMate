import React, { useState } from "react";
import LibraryShelf from "../LibraryShelf/LibraryShelf.jsx";
import SearchBar from "../searchbar/searchBar";
import SearchResultsList from "../searchbar/searchResultsList";

const EditLibrary = ({ libraryData, setLibraryData }) => {
	const [faveResults, setFaveResults] = useState([]);
	const [wishResults, setWishResults] = useState([]);
	const [faveSearchTerm, setFaveSearchTerm] = useState("");
	const [wishSearchTerm, setWishSearchTerm] = useState("");

	const addToFaveBooks = async (result) => {
		try {
			const newFaveBooks = [...libraryData.Fave_Books, result.ISBN];
			setLibraryData((prevLibraryData) => ({
				...prevLibraryData,
				Fave_Books: newFaveBooks,
			}));
		} catch (error) {
			console.error("Error adding to Fave Books:", error);
		}
	};

	const addToWishList = async (result) => {
		try {
			const newWishList = [...libraryData.Wish_List, result.ISBN];
			setLibraryData((prevLibraryData) => ({
				...prevLibraryData,
				Wish_List: newWishList,
			}));
		} catch (error) {
			console.error("Error adding to Wish List:", error);
		}
	};

	const removeFaveBook = (isbn) => {
		const newFaveBooks = libraryData.Fave_Books.filter(
			(bookISBN) => bookISBN !== isbn
		);
		setLibraryData((prevLibraryData) => ({
			...prevLibraryData,
			Fave_Books: newFaveBooks,
		}));
	};

	const removeWishBook = (isbn) => {
		const newWishList = libraryData.Wish_List.filter(
			(bookISBN) => bookISBN !== isbn
		);
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
						books={libraryData.Fave_Books}
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
						books={libraryData.Wish_List}
						editState={1}
						removeBook={removeWishBook}
					/>
				</div>
			</div>
		</div>
	);
};

export default EditLibrary;
