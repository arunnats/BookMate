// /src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Recommendations from "./pages/Recommendations";
import Navbar from "./components/Navbar/Navbar";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Footer from "./components/Footer/Footer";

const App = () => {
	return (
		<Router>
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/about" element={<About />} />
				<Route path="/recommendations" element={<Recommendations />} />
			</Routes>

			{/* <Footer />	 */}
		</Router>
	);
};

export default App;
