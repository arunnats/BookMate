import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LibraryPage from "../components/LibraryPage/LibraryPage";
import EditLibrary from "../components/EditLibrary/EditLibrary";

const Library = () => {
	const [isEditing, setIsEditing] = useState(false);

	const handleButtonClick = () => {
		setIsEditing(!isEditing);
	};

	return (
		<div className="flex flex-col items-center py-8 min-h-screen">
			<h1 className="text-center">Library Page</h1>
			<br />
			<button className="btn btn-primary" onClick={handleButtonClick}>
				{isEditing ? "Save Changes" : "Edit Library"}
			</button>
			<br />
			{isEditing ? <EditLibrary /> : <LibraryPage />}
		</div>
	);
};

export default Library;
