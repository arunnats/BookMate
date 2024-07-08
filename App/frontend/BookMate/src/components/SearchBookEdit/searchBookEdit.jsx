import React from "react";
import SearchBar from "../searchbar/searchBar";
import SearchResultsList from "../searchbar/searchResultsList";
import axios from "axios";
import { useState } from "react";

const SearchAndResults = () => {
	const [results, setResults] = useState([]);
	const [recommendations, setRecommendations] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const nodeURL = import.meta.env.VITE_NODE_URL;
	const fastAPIURL = import.meta.env.VITE_FASTAPI_URL;

	const getRecommendations = async (result) => {
		try {
			console.log(result);
			const response = await axios.get(
				`${fastAPIURL}recommend/?book_title=${result}`
			);
			console.log(response.data);
			const recommendationsData = response.data;

			setRecommendations(recommendationsData);
			setSearchTerm("");
			setResults([]);
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
		</div>
	);
};

export default SearchAndResults;
