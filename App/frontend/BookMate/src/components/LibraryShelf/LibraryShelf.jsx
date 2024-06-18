import React, { useContext, useEffect } from "react";
import BookCard from "../BookCard/BookCard.jsx";

const LibraryShelf = ({ books }) => {
	// const [book_list] = bookDetails;
  const bookCards = [];
	console.log(books);

  for (let i = 0; i < books.length; i++) {
		const bookDetails = books[i];
		bookCards.push(
			<div key={i} className="p-2">
				<BookCard bookDetails={bookDetails} />
			</div>
		)

	return (
		<div>
			<div className="carousel carousel-center max-w-[80rem] p-4 space-x-4 bg-neutral rounded-box">
				<div className="carousel-item">
					<img
						src="https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.jpg"
						className="rounded-box"
					/>
				</div>
				<div className="carousel-item">
					<img
						src="https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.jpg"
						className="rounded-box"
					/>
				</div>
				<div className="carousel-item">
					<img
						src="https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.jpg"
						className="rounded-box"
					/>
				</div>
				<div className="carousel-item">
					<img
						src="https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.jpg"
						className="rounded-box"
					/>
				</div>
				<div className="carousel-item">
					<img
						src="https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.jpg"
						className="rounded-box"
					/>
				</div>
				<div className="carousel-item">
					<img
						src="https://img.daisyui.com/images/stock/photo-1559181567-c3190ca9959b.jpg"
						className="rounded-box"
					/>
				</div>
				<div className="carousel-item">
					<img
						src="https://img.daisyui.com/images/stock/photo-1601004890684-d8cbf643f5f2.jpg"
						className="rounded-box"
					/>
				</div>
			</div>
		</div>
	);
};

export default LibraryShelf;
