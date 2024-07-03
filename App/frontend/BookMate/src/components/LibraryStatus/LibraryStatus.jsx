import React from "react";
import { Link } from "react-router-dom";

const LibraryStatus = ({ faveBooksSize, wishListSize }) => {
	return (
		<>
			{faveBooksSize + wishListSize > 3 ? (
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
						You need to have at least 4 books across your wish list and
						favourites!
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
