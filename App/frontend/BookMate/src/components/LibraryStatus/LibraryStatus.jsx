import React from "react";
import { Link } from "react-router-dom";

const LibraryStatus = ({ faveBooksSize, wishListSize, bookmateStatus }) => {
	return (
		<div>
			{bookmateStatus === 1 && (
				<div className="flex flex-col justify-center align-middle">
					<p className="text-2xl mt-2 text-white">
						Add more than 3 books to your Library so we can find your match!
					</p>
					<div className="mx-auto">
						<Link
							to="/library"
							className="btn text-l w-[120px] text-white font-poppins"
						>
							Go to your Library!
						</Link>
					</div>
				</div>
			)}
			{bookmateStatus === 2 && (
				<div className="flex flex-col justify-center align-middle">
					{faveBooksSize + wishListSize >= 3 ? (
						<div>
							<p className="text-2xl mt-2 text-white">
								You have {faveBooksSize + wishListSize} books in your library!
								The more you add, the better the accuracy of the match!
							</p>
						</div>
					) : (
						<div>
							<p className="text-2xl mt-2 text-white">
								You need to have at least 3 books in your library so we can find
								your Bookmate!
							</p>
						</div>
					)}
					<div className="mx-auto">
						<Link
							to="/library"
							className="btn text-l w-[120px] text-white font-poppins"
						>
							Go to your Library!
						</Link>
					</div>
				</div>
			)}
			{bookmateStatus === 3 && (
				<div className="flex flex-col justify-center align-middle">
					<p className="text-2xl mt-2 text-white">
						You've found your Bookmate! You can still manage and add to your
						Library!
					</p>
					<div className="mx-auto">
						<Link
							to="/library"
							className="btn text-l w-[120px] text-white font-poppins"
						>
							Go to your Library!
						</Link>
					</div>
				</div>
			)}
		</div>
	);
};

export default LibraryStatus;
