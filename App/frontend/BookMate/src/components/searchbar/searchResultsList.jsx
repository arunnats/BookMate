import React, { useEffect, useRef } from "react";
import SearchResult from "./searchResult";

const SearchResultsList = ({ results, onResultClick }) => {
	const containerRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target)
			) {
				onResultClick(null); // Handle outside click
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [onResultClick]);

	return (
		<div
			ref={containerRef}
			className="w-[22rem] text-primary font-poppins flex flex-col rounded-box border-2 shadow-xl border-primary px-4 bg-neutral mt-2 max-h-72 overflow-y-auto z-50 absolute top-14"
		>
			{results.map((result, index) => (
				<SearchResult
					result={result}
					key={index}
					onClick={() => onResultClick(result)}
				/>
			))}
		</div>
	);
};

export default SearchResultsList;
