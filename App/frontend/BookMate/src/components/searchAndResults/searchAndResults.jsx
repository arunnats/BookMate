import React, { useState, useEffect, useRef } from "react";
import SearchBar from "../searchbar/searchBar";
import SearchResultsList from "../searchbar/searchResultsList";
import ReccInfo from "../ReccInfo/ReccInfo";
import Results from "../results/results";
import styles from "../../css/SquigglyLine.module.css";
import axios from "axios";

const SearchAndResults = () => {
	const [results, setResults] = useState([]);
	const [recommendations, setRecommendations] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const containerRef = useRef(null);

	const getRecommendations = async (result) => {
		try {
			console.log(result);
			const Title = result["Book-Title"];
			const response = await axios.get(
				`http://localhost:8000/recommend/?book_title=${Title}`
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

	const getRandom = async () => {
		try {
			const response = await axios.get(`http://localhost:8000/random-books/`);
			const randomTitles = response.data;
			setRecommendations(randomTitles);
		} catch (error) {
			console.error("Error fetching recommendations:", error);
		}
	};

	const handleOutsideClick = (event) => {
		if (containerRef.current && !containerRef.current.contains(event.target)) {
			setSearchTerm("");
			setResults([]);
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleOutsideClick);
		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
		};
	}, []);

	return (
		<div className={`bg-primary ${styles.box}`}>
			<div className="min-h-[4vh]"></div>

			<ReccInfo />
			<div
				className={`search-bar-container w-[95vw] flex flex-col m-auto justify-center items-center relative overflow-hidden`}
				id="recommendations"
				ref={containerRef}
			>
				<h1 className="text-secondary font-poppins font-bold text-3xl my-2 mt-0">
					Enter the title of a Book:
				</h1>
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
				<button
					className="btn btn-secondary m-2 font-poppins mb-8"
					onClick={getRandom}
				>
					Get Random Books
				</button>
				<div className="min-h-[7vh]"></div>
			</div>
		</div>
	);
};

export default SearchAndResults;
