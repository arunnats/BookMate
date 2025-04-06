import React from "react";
import { Link } from "react-router-dom";

const BookCard = ({ bookDetails }) => {
  // Check if bookDetails exists
  if (!bookDetails) {
    return <div>No book details available</div>;
  }

  const { title, author, image_url, year, isbn } = bookDetails;

  const handleError = (e) => {
    e.target.src = `http://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`; // Fallback image URL
  };

  return (
    <div className="card card-compact w-[300px] bg-secondary border-2 shadow-xl border-primary">
      <figure>
        <img
          className="m-3"
          src={image_url}
          alt={title}
          onError={handleError}
        />
      </figure>
      <div className="card-body flex flex-col align-middle">
        <h2 className="card-title justify-center text-primary font-poppins">
          {title}
        </h2>
        <p className="card-text text-primary font-poppins">Author: {author}</p>
        <p className="card-text text-primary font-poppins">Year: {year}</p>
        <p className="card-text text-primary font-poppins">ISBN: {isbn}</p>
        <div className="card-actions justify-center font-poppins">
          {/* 
          <button className="btn btn-accent">
            <Link className="font-poppins" to={`/book/${isbn}`}>
              View Book
            </Link>
          </button>
          */}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
