import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import styles from "../css/SquigglyLine.module.css";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../userContext.js";

const UpdateDetails = () => {
	const { user, setUser } = useContext(UserContext);
	const navigate = useNavigate();
	const [bookmateStatus, setBookmateStatus] = useState(0);

	useEffect(() => {
		const bookmateStatusGetInit = async () => {
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

		bookmateStatusGetInit();
	}, []);

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

		const intervalId = setInterval(bookmateStatusGet, 5000);

		return () => clearInterval(intervalId);
	}, []);

	useEffect(() => {
		if (!user) {
			navigate("/login");
		}
	}, []);

	return (
		<div
			className={`bg-primary mx-auto min-h-[85vh] flex flex-col items-center justify-center ${styles.box}`}
		>
			{bookmateStatus === 0 ? (
				<div className="text-white text-center m-3 my-6">
					<h1 className="text-4xl font-bold">Under Maintenance</h1>
					<p className="text-2xl mt-2">
						Book Mate is currently under maintenance. Please check back later.
					</p>
				</div>
			) : (
				<div className="text-white text-center m-3 my-6">
					<h1 className="text-4xl font-bold">Update details</h1>
				</div>
			)}
		</div>
	);
};

export default UpdateDetails;
