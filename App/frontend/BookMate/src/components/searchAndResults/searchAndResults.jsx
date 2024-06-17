import React from "react";

import SearchBar from "../searchbar/searchBar";
import SearchResultsList from "../searchbar/searchResultsList";
import Results from "../results/results";
import axios from "axios";
import { useState } from "react";

const SearchAndResults = () => {
	const [results, setResults] = useState([]);
	const [recommendations, setRecommendations] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");

	const getRecommendations = async (result) => {
		try {
			console.log(result);
			const response = await axios.get(
				`http://localhost:8000/recommend/?book_title=${result}`
			);
			console.log(response.data);
			const recommendationsData = response.data;
			const formattedRecommendations = recommendationsData.map(
				(book) => `${book[0]} - ${book[1]}`
			);
			setRecommendations(formattedRecommendations);
			setSearchTerm("");
			setResults([]);
		} catch (error) {
			console.error("Error fetching recommendations:", error);
		}
	};

	const getRandom = async () => {
		try {
			const response = await axios.get(`http://localhost:8000/random-books/`);
			const randomTitles = response.data;
			const formattedRecommendations = randomTitles.map(
				(book) => `${book[0]} - ${book[1]}`
			);
			setRecommendations(formattedRecommendations);
		} catch (error) {
			console.error("Error fetching recommendations:", error);
		}
	};

	return (
		<div
			className="search-bar-container w-full flex flex-col justify-center items-center "
			id="recommendations"
		>
			<SearchBar
				setResults={setResults}
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
			/>
			{results && results.length > 0 && (
				<SearchResultsList
					results={results}
					onResultClick={getRecommendations}
				/>
			)}
			<br />
			<Results className="relative z-40" recommendations={recommendations} />
			<br />
			<button className="btn btn-primary" onClick={getRandom}>
				Get Random Books
			</button>
		</div>
	);
};

export default SearchAndResults;
