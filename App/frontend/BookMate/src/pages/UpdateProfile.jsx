import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import styles from "../css/SquigglyLine.module.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../userContext.js";

const UpdateDetails = () => {
	const { user, setUser } = useContext(UserContext);
	const navigate = useNavigate();
	const [bookmateStatus, setBookmateStatus] = useState(0);
	const [selectedProfilePicture, setSelectedProfilePicture] = useState(
		user?.picture_url || user?.profile_done
			? user.picture_url
			: profilePictures[6].url
	);
	const [nickname, setNickname] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [instagramId, setInstagramId] = useState("");
	const [disabled, setDisabled] = useState(true);
	const [instagramPublic, setInstagramPublic] = useState(true);
	const [emailPublic, setEmailPublic] = useState(true);
	const [phonePublic, setPhonePublic] = useState(true);

	const profilePictures = [
		{
			id: 1,
			url: "https://raw.githubusercontent.com/arunnats/BookMate/main/App/frontend/BookMate/src/assets/images/profilePictures/profilePicture1.svg?sanitize=true",
		},
		{
			id: 2,
			url: "https://raw.githubusercontent.com/arunnats/BookMate/main/App/frontend/BookMate/src/assets/images/profilePictures/profilePicture2.svg?sanitize=true",
		},
		{
			id: 3,
			url: "https://raw.githubusercontent.com/arunnats/BookMate/main/App/frontend/BookMate/src/assets/images/profilePictures/profilePicture3.svg?sanitize=true",
		},
		{
			id: 4,
			url: "https://raw.githubusercontent.com/arunnats/BookMate/main/App/frontend/BookMate/src/assets/images/profilePictures/profilePicture4.svg?sanitize=true",
		},
		{
			id: 5,
			url: "https://raw.githubusercontent.com/arunnats/BookMate/main/App/frontend/BookMate/src/assets/images/profilePictures/profilePicture5.svg?sanitize=true",
		},
		{
			id: 6,
			url: "https://raw.githubusercontent.com/arunnats/BookMate/main/App/frontend/BookMate/src/assets/images/profilePictures/profilePicture6.svg?sanitize=true",
		},
		{
			id: 7,
			url: user.picture_url,
		},
	];

	useEffect(() => {
		const bookmateStatusGetInit = async () => {
			try {
				const response = await axios.get(
					"http://localhost:3000/get-bookmate-status"
				);
				const { status } = response.data;
				setBookmateStatus(status);
			} catch (error) {
				console.error("Error fetching bookmate status:", error.message);
			}
		};

		bookmateStatusGetInit();
	}, []);

	useEffect(() => {
		if (
			instagramId.length > 0 &&
			phoneNumber.length === 10 &&
			(instagramPublic || emailPublic || phonePublic)
		) {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	}, [phoneNumber, instagramId, instagramPublic, emailPublic, phonePublic]);

	const handleSave = async () => {
		try {
			const response = await axios.post("http://localhost:3000/update-user", {
				id: user.LibID,
				picture_url: selectedProfilePicture,
				nickname: nickname,
				phone_number: phoneNumber,
				instagram_id: instagramId,
				profile_done: 1,
			});
			user.profile_done = 1;
			console.log(response.data.message);

			const responseUser = await axios.post(
				"http://localhost:3000/user-details",
				{
					id: user.id,
				}
			);
			const updatedUser = responseUser.data.user;

			console.log(updatedUser);

			setUser(updatedUser);

			console.log(user);

			navigate("/find-your-match");
		} catch (error) {
			console.error("Error updating user data:", error.message);
		}
	};

	const handleProfilePictureChange = (event) => {
		setSelectedProfilePicture(event.target.value);
	};

	const handleNicknameChange = (event) => {
		const sanitizedValue = event.target.value.replace(/[^A-Za-z]/gi, "");
		setNickname(sanitizedValue);
	};

	const handlePhoneNumberChange = (event) => {
		const sanitizedValue = event.target.value.replace(/\D/g, "").slice(0, 10);
		setPhoneNumber(sanitizedValue);
	};

	const handleInstagramIdChange = (event) => {
		const sanitizedValue = event.target.value
			.replace(/[^A-Za-z0-9._]/gi, "")
			.slice(0, 30);
		setInstagramId(sanitizedValue);
	};

	const handleInstagramToggle = () => {
		setInstagramPublic(!instagramPublic);
	};

	const handlePhoneToggle = () => {
		setPhonePublic(!phonePublic);
	};

	const handleEmailToggle = () => {
		setEmailPublic(!emailPublic);
	};

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
					<h1 className="text-4xl font-bold">Update Details</h1>
					<div className="flex flex-wrap justify-center items-center space-x-4 mt-4">
						{profilePictures.map((profile) => (
							<label key={profile.id} className="flex items-center">
								<input
									type="radio"
									name="profilePicture"
									className="radio"
									value={profile.url}
									checked={selectedProfilePicture === profile.url}
									onChange={handleProfilePictureChange}
								/>
								<img
									src={profile.url}
									alt={`Profile ${profile.id}`}
									className="w-20 h-20 rounded-full shadow-md mx-auto"
								/>
								<span className="ml-2 text-sm">{`Option ${profile.id}`}</span>
							</label>
						))}
					</div>
					<input
						type="text"
						placeholder="Nickname (optional)"
						className="input input-bordered w-full max-w-xs mt-4"
						value={nickname}
						onChange={handleNicknameChange}
					/>
					<input
						type="text"
						placeholder="Phone Number"
						className="input input-bordered w-full max-w-xs mt-4"
						value={phoneNumber}
						onChange={handlePhoneNumberChange}
						required
					/>
					<input
						type="text"
						placeholder="Instagram ID"
						className="input input-bordered w-full max-w-xs mt-4"
						value={instagramId}
						onChange={handleInstagramIdChange}
						required
					/>
					<div className="w-[300px] flex flex-col items-center">
						<div className="form-control my-2">
							<label className="label cursor-pointer flex justify-between">
								<span className="label-text">Make Instagram ID public?</span>
								<input
									type="checkbox"
									className={`toggle ${
										instagramPublic ? "toggle-accent" : "toggle-gray"
									}`}
									checked={instagramPublic}
									onChange={handleInstagramToggle}
								/>
							</label>
						</div>
						<div className="form-control my-2">
							<label className="label cursor-pointer flex justify-between">
								<span className="label-text">Make phone number public?</span>
								<input
									type="checkbox"
									className={`toggle ${
										phonePublic ? "toggle-accent" : "toggle-gray"
									}`}
									checked={phonePublic}
									onChange={handlePhoneToggle}
								/>
							</label>
						</div>
						<div className="form-control my-2">
							<label className="label cursor-pointer flex justify-between">
								<span className="label-text">Make email public?</span>
								<input
									type="checkbox"
									className={`toggle ${
										emailPublic ? "toggle-accent" : "toggle-gray"
									}`}
									checked={emailPublic}
									onChange={handleEmailToggle}
								/>
							</label>
						</div>
					</div>
					<button
						className="btn btn-primary mt-4"
						onClick={handleSave}
						disabled={disabled}
					>
						Save
					</button>
				</div>
			)}
		</div>
	);
};

export default UpdateDetails;
