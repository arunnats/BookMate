import React from "react";
import styles from "./SquigglyLine.module.css";
import heroLogo from "../../assets/images/hero-image.png";

const Hero = () => {
	return (
		<div className={`relative bg-primary min-h-[85vh] ${styles.box}`}>
			<div className="text-center text-neutral-content">
				<div className="flex flex-row max-w-[85vw] m-auto">
					<div className="min-h-[80vh] w-3/5 p-4 flex">
						<img
							clas
							src={heroLogo}
							alt="Hero"
							className="max-w-full h-auto object-contain align-middle justify-center"
						/>
					</div>
					<div className="min-h-[80vh] w-2/5 p-4"></div>
				</div>
			</div>
		</div>
	);
};

export default Hero;