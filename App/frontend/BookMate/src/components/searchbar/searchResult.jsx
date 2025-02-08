import React from "react";

const SearchResult = ({ result, onClick }) => {
	return (
		<div className="search-result-item" onClick={onClick}>
			<p>{result["Book-Title"]}</p>
		</div>
	);
};

export default SearchResult;
