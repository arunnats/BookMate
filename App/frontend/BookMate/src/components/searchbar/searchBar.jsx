import React, { useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

const SearchBar = ({ setResults, searchTerm, setSearchTerm }) => {
	const fetchData = async (value) => {
		const nodeURL = import.meta.env.VITE_NODE_URL;
		const fastAPIURL = import.meta.env.VITE_FASTAPI_URL;

		// console.log(value);
		try {
			const response = await axios.get(`${nodeURL}search?q=${value}`);
			// console.log(response.data);
			setResults(response.data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const handleChange = (value) => {
		setSearchTerm(value);
		if (value === "") {
			setResults([]);
		} else {
			fetchData(value);
		}
	};

	return (
		<div className="flex flex-col mx-auto items-center w-80">
			<div className="w-full h-10 rounded-lg  px-4 bg-neutral flex items-center">
				<FaSearch className="text-primary font-montserrat" />
				<input
					placeholder="Type to search..."
					value={searchTerm}
					onChange={(e) => handleChange(e.target.value)}
					className="text-primary font-poppins bg-transparent border-none h-full text-lg w-full ml-2 focus:outline-none"
				/>
			</div>
		</div>
	);
};

export default SearchBar;
