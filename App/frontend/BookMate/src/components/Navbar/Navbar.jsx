import React, { useContext } from "react";
import { UserContext } from "../../userContext";
import { Link } from "react-router-dom";
import logo from "../../assets/Logo.png";
import githubLogo from "../../assets/icons8-github.svg";
import default_user from "../../assets/images/default_user.jpeg";

const Navbar = () => {
	const { user, setUser } = useContext(UserContext);

	const handleLogout = () => {
		localStorage.removeItem("user");
		setUser(null);
	};

	return (
		<div className="flex bg-primary">
			<div className="mx-4 my-2 navbar bg-neutral rounded-full">
				<div className="navbar-start">
					<div className="dropdown">
						<div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M4 6h16M4 12h8m-8 6h16"
								/>
							</svg>
						</div>
						<ul
							tabIndex={0}
							className="menu menu-sm dropdown-content mt-3 z-50 p-2 shadow bg-neutral rounded-box w-52 justify-start align-top"
						>
							<li>
								<Link to="/" className="btn btn-ghost text-m">
									Home
								</Link>
							</li>
							<li>
								<Link to="/recommendations" className="btn btn-ghost text-m">
									Recommendations
								</Link>
							</li>
							<li>
								<Link to="/about" className="btn btn-ghost text-m">
									About
								</Link>
							</li>
							{user ? (
								<>
									<li>
										<Link className="btn btn-ghost text-m" to="/Profile">
											Profile
										</Link>
									</li>
									<li>
										<Link className="btn btn-ghost text-m" to="/Library">
											Your Library
										</Link>
									</li>
									<li>
										<a className="btn btn-ghost text-m" onClick={handleLogout}>
											Logout
										</a>
									</li>
								</>
							) : (
								<li>
									<Link className="btn btn-ghost text-m" to="/login">
										Login
									</Link>
								</li>
							)}
							<li>
								<a
									href="https://github.com/arunnats/Flix/"
									className="btn btn-ghost text-xl"
								>
									<img
										className="mx-1 h-8 max-w-lg"
										src={githubLogo}
										alt="Logo"
									/>
								</a>
							</li>
						</ul>
					</div>
					<a href="https://www.arunnats.com/" className="btn btn-ghost text-xl">
						<img className="h-9 max-w-lg" src={logo} alt="Logo" />
					</a>
				</div>

				<div className="navbar-center hidden lg:flex">
					<Link to="/" className="btn btn-ghost text-m">
						Home
					</Link>
					<Link to="/recommendations" className="btn btn-ghost text-m">
						Recommendations
					</Link>
					<Link to="/about" className="btn btn-ghost text-m">
						About
					</Link>
				</div>

				<div className="navbar-end hidden lg:flex">
					<a
						href="https://github.com/arunnats/BookMate/"
						className="btn btn-ghost text-xl"
					>
						<img className="mx-1 h-8 max-w-lg" src={githubLogo} alt="Logo" />
					</a>
					<label className="flex cursor-pointer gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle cx="12" cy="12" r="5" />
							<path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
						</svg>
						<input
							type="checkbox"
							value="dark"
							className="toggle theme-controller"
						/>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
						</svg>
					</label>
					<div className="dropdown dropdown-end">
						<div
							tabIndex={0}
							role="button"
							className="btn btn-ghost btn-circle avatar"
						>
							<div className="w-10 rounded-full">
								<img
									alt="User Avatar"
									src={user ? user.picture_url : default_user}
									referrerPolicy="no-referrer"
								/>
							</div>
						</div>
						<ul
							tabIndex={0}
							className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-neutral rounded-box w-52"
						>
							{user ? (
								<>
									<li>
										<Link to="/Profile">Profile</Link>
									</li>
									<li>
										<Link to="/Library">Your Library</Link>
									</li>
									<li>
										<a onClick={handleLogout}>Logout</a>
									</li>
								</>
							) : (
								<li>
									<Link to="/login">Login</Link>
								</li>
							)}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
