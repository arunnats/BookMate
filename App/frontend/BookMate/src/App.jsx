import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import LoginPage from "./pages/LoginPage";
import Profile from "./pages/Profile";
import Library from "./pages/Library";
import Quiz from "./pages/Quiz";
import Book from "./pages/Book";
import Recommendations from "./pages/Recommendations";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

const App = () => {
	return (
		<Router>
			<div className="">
				<Navbar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/about" element={<About />} />
					<Route path="/recommendations" element={<Recommendations />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/library" element={<Library />} />
					<Route path="/book/:isbn" element={<Book />} />
					<Route path="/quiz" element={<Quiz />} />
				</Routes>
				<Footer />
			</div>
		</Router>
	);
};

export default App;
