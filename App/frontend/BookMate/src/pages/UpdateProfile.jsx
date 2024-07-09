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
	const [nickname, setNickname] = useState(user?.nickname || "");
	const [phoneNumber, setPhoneNumber] = useState(user?.phone_num || "");
	const [instagramId, setInstagramId] = useState(user?.instagram || "");
	const [disabled, setDisabled] = useState(true);
	const [instagramPublic, setInstagramPublic] = useState(
		user?.instagram_public || false
	);
	const [emailPublic, setEmailPublic] = useState(user?.email_public || false);
	const [phonePublic, setPhonePublic] = useState(user?.phone_public || false);
	const nodeURL = import.meta.env.VITE_NODE_URL;
	const fastAPIURL = import.meta.env.VITE_FASTAPI_URL;

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
	];

	useEffect(() => {
		const bookmateStatusGetInit = async () => {
			try {
				const response = await axios.get(`${nodeURL}get-bookmate-status`);
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
			instagramId?.length > 0 &&
			phoneNumber?.length === 10 &&
			(instagramPublic || emailPublic || phonePublic)
		) {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	}, [phoneNumber, instagramId, instagramPublic, emailPublic, phonePublic]);

	const handleSave = async () => {
		try {
			const response = await axios.post(`${nodeURL}update-user`, {
				id: user.id,
				picture_url: selectedProfilePicture,
				nickname: nickname,
				phone_number: phoneNumber,
				instagram_id: instagramId,
				profile_done: 1,
				instagram_public: instagramPublic,
				phone_public: phonePublic,
				email_public: emailPublic,
			});
			user.profile_done = 1;
			console.log(response.data.message);

			const responseUser = await axios.post(`${nodeURL}user-details`, {
				id: user.id,
			});
			const updatedUser = responseUser.data.user;

			console.log(updatedUser);

			setUser(updatedUser);

			console.log(user);

			navigate("/Profile");
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
				<div className=" text-center m-3 my-6">
					<h1 className="text-4xl text-secondary font-poppins font-bold my-3 text-center">
						Update Details
					</h1>
					<div className="flex flex-wrap justify-center items-center space-x-4 mt-4 w-[60vw] m-3">
						{profilePictures.slice(0, 6).map((profile) => (
							<label key={profile.id} className="flex items-center mx-4">
								<img
									src={profile.url}
									alt={`Profile ${profile.id}`}
									className="w-20 h-20 rounded-full shadow-md mx-auto"
								/>
								<input
									type="radio"
									name="profilePicture"
									className={`radio mx-2 ${
										selectedProfilePicture === profile.url
											? "text-primary"
											: "text-gray-400"
									}`}
									value={profile.url}
									checked={selectedProfilePicture === profile.url}
									onChange={handleProfilePictureChange}
								/>
								<span
									className={`font-poppins font-bold mx-2 ${
										selectedProfilePicture === profile.url
											? "text-secondary"
											: "text-gray-400"
									}`}
								>{`Option ${profile.id}`}</span>
							</label>
						))}

						{user.picture_url >= 1 && user.picture_url <= 6 && (
							<label key={7} className="flex items-center mx-4">
								<input
									type="radio"
									name="profilePicture"
									className="radio"
									value={profilePictures[6].url}
									checked={selectedProfilePicture === profilePictures[6].url}
									onChange={handleProfilePictureChange}
								/>
								<img
									src={profilePictures[6].url}
									alt={`Profile ${7}`}
									className="w-20 h-20 rounded-full shadow-md mx-auto"
								/>
								<span className="text-secondary font-poppins font-bold mx-4">{`Option ${7}`}</span>
							</label>
						)}
					</div>

					<div className="flex flex-col justify-center items-center mt-4">
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
					</div>

					<div className="w-[350px] flex flex-col items-center mx-auto">
						<div className=" my-2">
							<span className="label-text text-secondary font-poppins text-xl m-2 mt-4 font-semibold">
								You must make one of the following public to continue:
							</span>
						</div>
						<div className="form-control my-1">
							<label className="label cursor-pointer flex justify-between">
								<span className="label-text text-secondary font-poppins text-lg mx-2 font-semibold">
									Make Instagram ID public?
								</span>
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

						<div className="form-control my-1">
							<label className="label cursor-pointer flex justify-between">
								<span className="label-text text-secondary font-poppins text-lg mx-2 font-semibold">
									Make phone number public?
								</span>
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
						<div className="form-control my-1">
							<label className="label cursor-pointer flex justify-between">
								<span className="label-text text-secondary font-poppins text-lg mx-2 font-semibold">
									Make email public?
								</span>
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
					<div className="mx-auto">
						<button
							className="btn btn-secondary m-2 font-poppins"
							onClick={handleSave}
							disabled={disabled}
						>
							Save
						</button>
					</div>
				</div>
			)}
			<div className="min-h-[7vh]"></div>
		</div>
	);
};

export default UpdateDetails;
