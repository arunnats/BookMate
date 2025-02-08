import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./SquigglyLine.module.css";
import heroLogo from "../../assets/images/matchmaker-logo.png";
import doggo from "../../assets/images/doggo.png";
import { Link } from "react-router-dom";

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
				x: 25,
				y: -100,
				scaleX: 1.6,
				scaleY: 1.6,
			},
			{
				x: 25,
				y: -37,
				scaleX: 1.6,
				scaleY: 1.6,
				scrollTrigger: {
					trigger: doggoRef.current,
					start: "top 80%",
					end: "top 20%",
					scrub: true,
					markers: false,
				},
			}
		);
	}, []);

	return (
		<div
			className={`relative bg-primary md:min-h-[90vh] flex items-center justify-center ${styles.box}`}
		>
			<div className="text-center text-neutral-content w-full">
				<div className="flex flex-col md:flex-row max-w-[100vw] m-auto">
					<div className=" w-[10%] hidden md:flex flex-col items-center">
						<img
							ref={doggoRef}
							src={doggo}
							alt="MapImg"
							className="max-w-full h-auto object-contain pl-6"
						/>
					</div>
					<div className="sm:w-full md:w-[46%] flex items-center justify-center">
						<img
							ref={imgRef}
							src={heroLogo}
							alt="Hero"
							className="max-w-full h-auto object-contain align-middle justify-center p-10"
						/>
					</div>
					<div className=" sm:w-full md:w-[34%] flex flex-col items-center justify-center p-1">
						<h1 className="text-3xl md:text-4xl 2xl:text-5xl font-bold text-secondary font-poppins p-1">
							Match Making
						</h1>
						<p className="text-xl 2xl:text-2xl text-accent font-montserrat p-5 md:p-1 font-medium text-justify">
							Find someone who shares a similar reading profile by adding your
							favorite books to your library and taking our quirky
							questionnaire. Our super-smart AI model searches far and wide to
							find your Book Mate!
						</p>
						<div className="flex flex-row justify-center">
							<Link
								className="btn btn-secondary m-2 font-poppins"
								to="/find-your-match"
							>
								Let's go!
							</Link>
						</div>
					</div>
					<div className=" w-[10%] hidden md:flex flex-col-reverse"></div>
				</div>
			</div>
		</div>
	);
};

export default Hero;
