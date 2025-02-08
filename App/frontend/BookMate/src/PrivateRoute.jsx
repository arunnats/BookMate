import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "./userContext.js";
import AppOffline from "./components/AppOffline/AppOffline";

const PrivateRoute = ({ children, activated }) => {
	const { user } = useContext(UserContext);

	if (!user) {
		return <Navigate to="/login" />;
	}

	if (!activated) {
		return <AppOffline />;
	}

	if (!user.profile_done) {
		return <Navigate to="/update-profile" />;
	}

	return children ? children : <Outlet />;
};

export default PrivateRoute;
