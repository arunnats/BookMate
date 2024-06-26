import React from "react";
import styles from "./SquigglyLine.module.css";
import heroLogo from "../../assets/images/hero-image.png";

const Hero = () => {
	return (
		<div
			className={`relative bg-primary min-h-[80vh] flex items-center justify-center ${styles.box}`}
		>
			<div className="text-center text-neutral-content w-full">
				<div className="flex flex-row max-w-[80vw] m-auto p-4">
					<div className="min-h-[80vh] w-3/5 flex items-center justify-center">
						<img
							src={heroLogo}
							alt="Hero"
							className="max-w-full h-auto object-contain align-middle justify-center p-10"
						/>
					</div>
					<div className="min-h-[80vh] w-2/5 flex flex-col items-center justify-center">
						<h1 className="text-6xl font-bold text-white">
							Welcome to BookMate
						</h1>
						<p className="text-2xl text-white">
							Your one stop destination for all your book needs.
						</p>
						<div className="flex flex-row justify-center">
							<button className="btn btn-primary m-2">Get Started</button>
							<button className="btn btn-secondary m-2">Learn More</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Hero;
