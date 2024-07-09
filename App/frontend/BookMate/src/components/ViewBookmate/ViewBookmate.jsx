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
				const responseBookMateID = await axios.post(`${nodeURL}user-details`, {
					id: user.id,
				});

				const { bookMateID } = responseBookMateID;
				const responseBookMate = await axios.post(`${nodeURL}user-details`, {
					id: responseBookMateID.data.user.BookmateID,
				});

				setBookmateDetails(responseBookMate.data.user);
			} catch (error) {
				console.error("Error fetching bookmate details:", error.message);
			}
		};

		if (user) {
			bookmateDetailsGet();
		}
	}, [user]);

	useEffect(() => {
		if (!user) {
			navigate("/login");
		} else {
		}
	}, [user, navigate]);

	if (!user) {
		return <p>Loading...</p>;
	}

	return (
		<div className="bg-primary min-h-[80vh] flex flex-col items-center justify-center">
			<h1 className="text-4xl font-bold text-secondary font-poppins my-2">
				Hey {user.nickname ? user.nickname : user.first_name}
			</h1>
			<h1 className="text-4xl font-bold text-secondary font-poppins ">
				It's a match!
			</h1>
			{bookmateStatus === 3 && bookmateDetails ? (
				<div className="flex flex-col justify-center align-middle">
					<h1 className="text-2xl font-bold text-secondary font-poppins my-1">
						Your bookmate is{" "}
						{bookmateDetails.nickname
							? bookmateDetails.nickname
							: bookmateDetails.first_name}
					</h1>
					<img
						src={bookmateDetails.picture_url}
						alt=""
						className="w-[100px] h-auto m-auto my-3"
					/>
					<h1 className="text-2xl font-bold text-secondary font-poppins my-1">
						Reach out to them!
					</h1>
					{bookmateDetails.instagram_public && (
						<h1 className="text-2xl font-bold text-secondary font-poppins my-1">
							Instagram: {bookmateDetails.instagram}
						</h1>
					)}

					{bookmateDetails.phone_public && (
						<h1 className="text-2xl font-bold text-secondary font-poppins my-1">
							Phone number: {bookmateDetails.phone_num}
						</h1>
					)}

					{bookmateDetails.email_public && (
						<h1 className="text-2xl font-bold text-secondary font-poppins my-1">
							Email: {bookmateDetails.email}
						</h1>
					)}
				</div>
			) : (
				<div className="bg-primary min-h-[80vh] flex flex-col items-center justify-center">
					<h1 className="text-4xl font-bold text-secondary font-poppins mb-6">
						You didnt opt in this time. Stay tuned for the next round!
					</h1>
				</div>
			)}
		</div>
	);
};

export default ViewBookmate;
