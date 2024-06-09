import React from "react";
import githubLogo from "../../assets/icons8-github.svg";
import linkedinLogo from "../../assets/icons8-linkedin.svg";

const Footer = () => {
	return (
		<footer className="footer items-center p-2 bg-neutral text-neutral-content">
			<aside className="items-center grid-flow-col">
				<p>BookMate - By Arun Natarajan</p>
			</aside>
			<nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
				<a
					href="https://www.linkedin.com/in/arun-natarajan-567539211//"
					className="btn btn-ghost text-xl"
				>
					<img className="mx-1 h-8 max-w-lg" src={linkedinLogo} alt="Logo" />
				</a>
				<a
					href="https://github.com/arunnats//"
					className="btn btn-ghost text-xl"
				>
					<img className="mx-1 h-8 max-w-lg" src={githubLogo} alt="Logo" />
				</a>
			</nav>
		</footer>
	);
};

export default Footer;
