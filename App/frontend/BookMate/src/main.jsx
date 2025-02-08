import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserContext } from "./userContext";
import "./index.css";
import { Analytics } from "@vercel/analytics/react";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const RootComponent = () => {
	const [user, setUser] = useState(() => {
		const storedUser = localStorage.getItem("user");
		return storedUser ? JSON.parse(storedUser) : null;
	});

	useEffect(() => {
		localStorage.setItem("user", JSON.stringify(user));
	}, [user]);

	return (
		<GoogleOAuthProvider clientId={clientId}>
			<UserContext.Provider value={{ user, setUser }}>
				<React.StrictMode>
					<App />
					<Analytics />
				</React.StrictMode>
			</UserContext.Provider>
		</GoogleOAuthProvider>
	);
};

ReactDOM.createRoot(document.getElementById("root")).render(<RootComponent />);
