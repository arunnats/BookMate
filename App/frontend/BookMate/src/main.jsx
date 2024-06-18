import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserContext } from "./userContext";
import "./index.css";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const RootComponent = () => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		// Check if user data is stored in local storage
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
		<GoogleOAuthProvider clientId={clientId}>
			<UserContext.Provider value={{ user, setUser }}>
				<React.StrictMode>
					<App />
				</React.StrictMode>
			</UserContext.Provider>
		</GoogleOAuthProvider>
	);
};

ReactDOM.createRoot(document.getElementById("root")).render(<RootComponent />);
