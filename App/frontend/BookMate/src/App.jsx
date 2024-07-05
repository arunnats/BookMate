import React, { useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import Home from "./pages/Home";
import About from "./pages/About";
import LoginPage from "./pages/LoginPage";
import Profile from "./pages/Profile";
import Library from "./pages/Library";
import Quiz from "./pages/Quiz";
import Book from "./pages/Book";
import BookmatePage from "./pages/Bookmate";
import Recommendations from "./pages/Recommendations";
import UpdateDetails from "./pages/UpdateProfile";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import AppOffline from "./components/AppOffline/AppOffline";
import ViewBookmate from "./components/ViewBookmate/ViewBookmate";
import PrivateRoute from "./PrivateRoute";

const App = () => {
	const [activated, setactivated] = useState(false);

	useEffect(() => {
		const appActiveGet = async () => {
			try {
				const response = await axios.get("http://localhost:3000/app-status");
				const { status } = response.data;

				setactivated(status);
				console.log("app is:" + activated);
			} catch (error) {
				console.error("Error fetching bookmate status:", error.message);
			}
		};

		appActiveGet();
	}, []);

	return (
		<Router>
			<div className="">
				<Navbar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/about" element={<About />} />
					<Route
						path="/recommendations"
						element={activated ? <Recommendations /> : <AppOffline />}
					/>
					<Route
						path="/login"
						element={activated ? <LoginPage /> : <AppOffline />}
					/>
					<Route
						path="/profile"
						element={
							<PrivateRoute activated={activated}>
								<Profile />
							</PrivateRoute>
						}
					/>
					<Route
						path="/library"
						element={
							<PrivateRoute activated={activated}>
								<Library />
							</PrivateRoute>
						}
					/>
					<Route
						path="/book/:isbn"
						element={
							<PrivateRoute activated={activated}>
								<Book />
							</PrivateRoute>
						}
					/>
					<Route
						path="/quiz"
						element={
							<PrivateRoute activated={activated}>
								<Quiz />
							</PrivateRoute>
						}
					/>
					<Route
						path="/find-your-match"
						element={
							<PrivateRoute activated={activated}>
								<BookmatePage />
							</PrivateRoute>
						}
					/>
					<Route
						path="/view-bookmate"
						element={
							<PrivateRoute activated={activated}>
								<ViewBookmate />
							</PrivateRoute>
						}
					/>
					<Route path="/update-profile" element={<UpdateDetails />} />
				</Routes>
				<Footer />
			</div>
		</Router>
	);
};

export default App;
