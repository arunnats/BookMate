import React from "react";

const SearchResult = ({ result, onClick }) => {
	return (
		<div
			className="py-2 px-5 cursor-pointer hover:bg-gray-200"
			onClick={() => onClick(result)}
		>
			{result}
		</div>
	);
};

export default SearchResult;
