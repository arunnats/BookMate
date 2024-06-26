import React from "react";
import githubLogo from "../../assets/icons8-github.svg";
import arunnats from "../../assets/Logo_arunnats.png";
import linkedinLogo from "../../assets/icons8-linkedin.svg";

const Footer = () => {
	return (
		<footer className="footer items-center p-2 bg-neutral text-neutral-content">
			<div className="items-center grid-flow-col">
				<p>Book Mate - By Arun Natarajan</p>
			</div>
			<nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
				<a className="btn btn-ghost" href="https://www.arunnats.com/">
					<img className=" h-8 max-w-lg" src={arunnats} alt="" />
				</a>
				<a
					href="https://www.linkedin.com/in/arun-natarajan-567539211//"
					className="btn btn-ghost text-xl"
				>
					<img className=" h-8 max-w-lg" src={linkedinLogo} alt="Logo" />
				</a>
				<a
					href="https://github.com/arunnats//"
					className="btn btn-ghost text-xl"
				>
					<img className=" h-8 max-w-lg" src={githubLogo} alt="Logo" />
				</a>
			</nav>
		</footer>
	);
};

export default Footer;
