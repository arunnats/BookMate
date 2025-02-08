import React from "react";

const BookInfoPage = ({ bookDetails }) => {
	const {
		title,
		author,
		description,
		pages,
		publishDate,
		physicalFormat,
		genres,
		ratings,
		imageUrl,
	} = bookDetails;

	return (
		<div className="flex items-center justify-center">
			<div className="card p-8 ">
				<div className="flex justify-center">
					<img
						src={imageUrl}
						alt={title}
						className="w-64 h-auto rounded-lg shadow-lg"
					/>
				</div>
				<div>
					<h1 className="text-2xl font-bold">{title}</h1>
					<p className="text-gray-600">Author: {author}</p>
					<p className="text-gray-600">Publish Date: {publishDate}</p>
					<p className="text-gray-600">Physical Format: {physicalFormat}</p>
					<p className="text-gray-600">Pages: {pages}</p>
					<p className="mt-4">{description}</p>
				</div>
			</div>
		</div>
	);
};

export default BookInfoPage;
