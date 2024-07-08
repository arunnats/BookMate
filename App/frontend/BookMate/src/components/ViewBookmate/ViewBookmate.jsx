import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../userContext.js";
import axios from "axios";

const ViewBookmate = () => {
	const { user, setUser } = useContext(UserContext);
	const navigate = useNavigate();
	const [bookmateStatus, setBookmateStatus] = useState(false);
	const [bookmateDetails, setBookmateDetails] = useState(null);
	const nodeURL = import.meta.env.VITE_NODE_URL;
	const fastAPIURL = import.meta.env.VITE_FASTAPI_URL;
	useEffect(() => {
		const bookmateStatusGet = async () => {
			try {
				const response = await axios.get(`${nodeURL}get-bookmate-status`);
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
		const bookmateDetailsGet = async () => {
			try {
				const response = await axios.post(`${nodeURL}user-details`, {
					id: user.BookmateID,
				});
				setBookmateDetails(response.data.user);
			} catch (error) {
				console.error("Error fetching bookmate details:", error.message);
			}
		};

		if (user && user.BookmateID) {
			bookmateDetailsGet();
		}
	}, [user]);

	useEffect(() => {
		if (!user) {
			navigate("/login");
		} else {
			console.log("Logged in");
		}
	}, [user, navigate]);

	if (!user) {
		return <p>Loading...</p>;
	}

	return (
		<div className="flex flex-col align-middle justify-center">
			<h1 className="text-3xl text-white font-bold my-3">
				Hey {user.nickname ? user.nickname : user.first_name}
			</h1>
			{bookmateStatus === 3 && user.BookmateID && bookmateDetails ? (
				<div className="flex flex-col">
					<h1 className="text-3xl text-white font-bold my-3">
						Your bookmate is {bookmateDetails.first_name}
					</h1>
					{user.instagram_public && (
						<h1 className="text-3xl text-white font-bold my-3">
							Instagram: {bookmateDetails.instagram}
						</h1>
					)}

					{user.phone_public && (
						<h1 className="text-3xl text-white font-bold my-3">
							Phone number: {bookmateDetails.phone_num}
						</h1>
					)}

					{user.email_public && (
						<h1 className="text-3xl text-white font-bold my-3">
							Email: {bookmateDetails.email}
						</h1>
					)}
				</div>
			) : (
				<h1 className="text-3xl text-white font-bold my-3">
					You didnt sign up for the last round of bookmate. You can try next
					time!
				</h1>
			)}
		</div>
	);
};

export default ViewBookmate;
