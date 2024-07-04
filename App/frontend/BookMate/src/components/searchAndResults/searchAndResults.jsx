import React, { useState, useEffect, useRef } from "react";
import SearchBar from "../searchbar/searchBar";
import SearchResultsList from "../searchbar/searchResultsList";
import Results from "../results/results";
import styles from "./SquigglyLine.module.css";
import axios from "axios";

const SearchAndResults = () => {
	const [results, setResults] = useState([]);
	const [recommendations, setRecommendations] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const containerRef = useRef(null);
	const [bookmateStatus, setBookmateStatus] = useState(false);

	useEffect(() => {
		const bookmateStatusGet = async () => {
			try {
				const response = await axios.get(
					"http://localhost:3000/get-bookmate-status"
				);
				const { status } = response.data;
				console.log(status);
				setBookmateStatus(status);
			} catch (error) {
				console.error("Error fetching bookmate status:", error.message);
			}
		};

		bookmateStatusGet();
	}, []);

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
			{bookmateStatus === 3 && user.BookmateID && (
				<div className="flex flex-col">
					<h1 className="text-3xl  text-white font-bold my-3">
						Book Mate results are out!
					</h1>
					<div>
						<Link
							to="/view-bookmate"
							className="btn text-l text-primary font-poppins"
						>
							See your bookmate!
						</Link>
					</div>
				</div>
			)}
			<div className="min-h-[7vh]"></div>
			<div
				className={`search-bar-container w-[95vw] flex flex-col m-auto justify-center items-center relative `}
				id="recommendations"
				ref={containerRef}
			>
				<h1>Recommendations Page</h1>
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
				<div className="min-h-[7vh]"></div>
			</div>
		</div>
	);
};

export default SearchAndResults;
