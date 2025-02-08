import React, { useState, useEffect, useRef } from "react";
import LibraryShelf from "../LibraryShelf/LibraryShelf.jsx";
import SearchBar from "../searchbar/searchBar";
import SearchResultsList from "../searchbar/searchResultsList";

const EditLibrary = ({ libraryData, setLibraryData }) => {
	const [faveResults, setFaveResults] = useState([]);
	const [wishResults, setWishResults] = useState([]);
	const [faveSearchTerm, setFaveSearchTerm] = useState("");
	const [wishSearchTerm, setWishSearchTerm] = useState("");

	const containerRef = useRef(null);

	const addToFaveBooks = (result) => {
		const newFaveBooks = new Set(libraryData.Fave_Books);
		newFaveBooks.add(result.ISBN);
		setLibraryData((prevLibraryData) => ({
			...prevLibraryData,
			Fave_Books: newFaveBooks,
		}));
		setFaveSearchTerm("");
		setFaveResults([]);
	};

	const addToWishList = (result) => {
		const newWishList = new Set(libraryData.Wish_List);
		newWishList.add(result.ISBN);
		setLibraryData((prevLibraryData) => ({
			...prevLibraryData,
			Wish_List: newWishList,
		}));
		setWishSearchTerm("");
		setWishResults([]);
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

	const handleOutsideClick = (event) => {
		if (containerRef.current && !containerRef.current.contains(event.target)) {
			setFaveSearchTerm("");
			setWishSearchTerm("");
			setFaveResults([]);
			setWishResults([]);
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleOutsideClick);
		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
		};
	}, []);

	return (
		<div ref={containerRef} className="relative">
			<div className="w-full flex flex-col p-1 items-center justify-center">
				<h1 className="text-4xl text-secondary font-poppins font-bold my-3 text-center">
					Your Books
				</h1>
				<div className="search-bar-container w-full flex flex-col justify-center items-center relative">
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
				<h1 className="text-4xl text-secondary font-poppins font-bold my-3 mt-10 text-center">
					Your WishList
				</h1>
				<div className="search-bar-container w-full flex flex-col justify-center items-center relative">
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
