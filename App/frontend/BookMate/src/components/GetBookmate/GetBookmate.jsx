import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import styles from "../css/SquigglyLine.module.css";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../userContext.js";

const GetBookmate = () => {
	const { user, setUser } = useContext(UserContext);
	const navigate = useNavigate();
	const [optedIn, setOptedIn] = useState(false);
	const [bookmateStatus, setBookmateStatus] = useState(false);

	useEffect(() => {
		const bookmateStatusGet = async () => {
			try {
				const response = await axios.get(
					"http://localhost:3000/get-bookmate-status"
				);
				const { status } = response.data;
				console.log(status);
				setBookmateStatus(status);
			} catch (error) {
				console.error("Error fetching bookmate status:", error.message);
			}
		};

		bookmateStatusGet();
	}, []);

	useEffect(() => {
		if (!user) {
			navigate("/login");
			return;
		}

		const fetchOptInStatus = async () => {
			try {
				const response = await axios.post(
					"http://localhost:3000/opt-status",
					null,
					{
						params: {
							id: user.id,
						},
					}
				);
				setOptedIn(response.data.optedIn);
			} catch (error) {
				console.error("Error fetching opt-in status:", error.message);
			}
		};

		fetchOptInStatus();

		if (!optedIn) {
			navigate("/find-your-match");
			return;
		}
	}, []);

	return <div>hai</div>;
};

export default GetBookmate;
