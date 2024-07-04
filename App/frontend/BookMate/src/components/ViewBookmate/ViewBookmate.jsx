import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../userContext.js";
import axios from "axios";

const ViewBookmate = () => {
	const { user, setUser } = useContext(UserContext);
	const navigate = useNavigate();
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
				Hey {user.first_name}
			</h1>
			{bookmateStatus === 3 && user.BookmateID ? (
				<h1 className="text-3xl text-white font-bold my-3">
					Your bookmate is {user.BookmateID}
				</h1>
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
