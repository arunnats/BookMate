import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./SquigglyLine.module.css";
import heroLogo from "../../assets/images/matchmaker-logo.png";
import doggo from "../../assets/images/doggo.png";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
	const imgRef = useRef(null);
	const doggoRef = useRef(null);

	useEffect(() => {
		const tl = gsap.timeline({
			repeat: -1,
			yoyo: true,
			onRepeat: () => {
				tl.invalidate();
			},
		});

		tl.to(imgRef.current, {
			rotate: ".8",
			duration: 1.2,
			ease: "none",
			y: -1,
			x: 1,
		}).to(imgRef.current, {
			rotate: "-.8",
			duration: 1.2,
			ease: "none",
			y: 1,
			x: -1,
		});

		gsap.fromTo(
			doggoRef.current,
			{
				x: -100,
				y: -100,
			},
			{
				x: 0,
				y: 0,
				scrollTrigger: {
					trigger: doggoRef.current,
					start: "top 80%", // Adjust as needed
					end: "top 20%", // Adjust as needed
					scrub: true,
					markers: true, // Remove or set to false in production
				},
			}
		);
	}, []);

	return (
		<div
			className={`relative bg-primary min-h-[90vh] flex items-center justify-center ${styles.box}`}
		>
			<div className="text-center text-neutral-content w-full">
				<div className="flex flex-row max-w-[100vw] m-auto">
					<div className="min-h-[80vh] w-[10%] flex flex-col items-center">
						<img
							ref={doggoRef}
							src={doggo}
							alt="MapImg"
							className="max-w-full h-auto object-contain pl-6"
						/>
					</div>
					<div className="min-h-[80vh] w-[48%] flex items-center justify-center">
						<img
							ref={imgRef}
							src={heroLogo}
							alt="Hero"
							className="max-w-full h-auto object-contain align-middle justify-center p-10"
						/>
					</div>
					<div className="min-h-[80vh] w-[32%] flex flex-col items-center justify-center">
						<h1 className="text-4xl font-bold text-secondary">
							Match Making Model
						</h1>
						<p className="text-2xl text-accent">
							Your one stop destination for all your book needs.
						</p>
						<div className="flex flex-row justify-center">
							<button className="btn btn-secondary m-2">Learn more</button>
						</div>
					</div>
					<div className="min-h-[80vh] w-[10%] flex flex-col-reverse"></div>
				</div>
			</div>
		</div>
	);
};

export default Hero;
