import React from "react";
import { Link } from "react-router-dom";

const LibraryStatus = ({ faveBooksSize, wishListSize, bookmateStatus }) => {
	return (
		<div>
			{bookmateStatus === 1 && (
				<div className="text-center w-[90%] md:w-[45%] m-auto my-1">
					<h1 className="text-secondary font-poppins font-bold text-3xl">
						1) Manage your library
					</h1>
					<p className="text-xl mt-2 font-montserrat text-accent font-medium text-justify">
						Add at least 3 books to your Library so we can find your match!
					</p>
					<div className="mx-auto">
						<Link to="/library" className="btn btn-secondary m-2 font-poppins">
							Add books!
						</Link>
					</div>
				</div>
			)}
			{bookmateStatus === 2 && (
				<div className="flex flex-col justify-center align-middle">
					{faveBooksSize + wishListSize >= 3 ? (
						<div className="text-center w-[90%] md:w-[45%] m-auto my-1">
							<h1 className="text-secondary font-poppins font-bold text-3xl">
								1) Manage your library
							</h1>
							<p className="text-xl mt-2 font-montserrat text-accent font-medium text-justify">
								You have {faveBooksSize + wishListSize} books in your library!
								The more you add, the better the accuracy of the match!
							</p>
						</div>
					) : (
						<div className="text-center w-[90%] md:w-[45%] m-auto my-1">
							<h1 className="text-secondary font-poppins font-bold text-3xl">
								1) Manage your library
							</h1>
							<p className="text-xl mt-2 font-montserrat text-accent font-medium text-justify">
								You need to have at least 3 books in your library so we can find
								your Bookmate!
							</p>
						</div>
					)}
					<div className="mx-auto">
						<Link to="/library" className="btn btn-secondary m-2 font-poppins">
							Go to your Library!
						</Link>
					</div>
				</div>
			)}
			{bookmateStatus === 3 && (
				<div className="text-center w-[90%] md:w-[45%] m-auto my-1">
					<h1 className="text-secondary font-poppins font-bold text-3xl">
						Manage your library
					</h1>
					<p className="text-xl mt-2 font-montserrat text-accent font-medium text-justify">
						You've found your Bookmate! You can still manage and add to your
						Library!
					</p>
					<div className="mx-auto">
						<Link to="/library" className="btn btn-secondary m-2 font-poppins">
							Go to your Library!
						</Link>
					</div>
				</div>
			)}
		</div>
	);
};

export default LibraryStatus;
