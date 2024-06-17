import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import LoginPage from "./pages/LoginPage";
import Profile from "./pages/Profile";
import Library from "./pages/Library";
import Book from "./pages/Book";
import Recommendations from "./pages/Recommendations";
import Navbar from "./components/Navbar/Navbar";
import { UserContext } from "./userContext";
import Footer from "./components/Footer/Footer";

const App = () => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			try {
				const parsedUser = JSON.parse(storedUser);
				setUser(parsedUser);
			} catch (error) {
				console.error("Error parsing user from localStorage:", error);
				localStorage.setItem("user", JSON.stringify(null)); // Set to null if parsing fails
				setUser(null);
			}
		} else {
			setUser(null);
		}
	}, []);

	return (
		<UserContext.Provider value={{ user, setUser }}>
			<Router>
				<Navbar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/about" element={<About />} />
					<Route path="/recommendations" element={<Recommendations />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/library" element={<Library />} />
					<Route path="/book/:isbn" element={<Book />} />
				</Routes>
				{/* <Footer /> */}
			</Router>
		</UserContext.Provider>
	);
};

export default App;
