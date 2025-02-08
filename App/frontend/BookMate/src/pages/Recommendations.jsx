import React, { useContext, useState, useEffect } from "react";
import SearchAndResults from "../components/searchAndResults/searchAndResults";

const Recommendations = () => {
	return (
		<div className="min-h-screen ">
			<SearchAndResults />
			<div className="h-4"></div>
		</div>
	);
};

export default Recommendations;
