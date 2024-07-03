import React from "react";
import { Link } from "react-router-dom";

const LibraryStatus = ({ faveBooksSize, wishListSize, isButtonVisible }) => {
	return (
		<>
			{isButtonVisible ? (
				<div className="flex flex-col justify-center align-middle">
					<p className="text-2xl mt-2">
						You have {faveBooksSize + wishListSize} books in your library! The
						more you add, the better the accuracy of the match!
					</p>
					<div>
						<Link
							to="/library"
							className="btn text-l w-[120px] text-primary font-poppins"
						>
							Go to your Library!
						</Link>
					</div>
				</div>
			) : (
				<div className="flex flex-col justify-center align-middle">
					<p className="text-2xl mt-2">
						You can add or remove books for the next round of Bookmate.
					</p>
					<div>
						<Link
							to="/library"
							className="btn text-l w-[120px] text-primary font-poppins"
						>
							Go to your Library!
						</Link>
					</div>
				</div>
			)}
		</>
	);
};

export default LibraryStatus;
