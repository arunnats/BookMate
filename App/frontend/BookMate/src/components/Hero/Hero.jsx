import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "../../css/SquigglyLine.module.css";
import heroLogo from "../../assets/images/hero-image.png";
import map from "../../assets/images/map.png";

const Hero = () => {
	const imgRef = useRef(null);
	const mapRef = useRef(null);

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
			y: -6,
			x: 1,
		}).to(imgRef.current, {
			rotate: "-.8",
			duration: 1.2,
			ease: "none",
			y: -4,
			x: -1,
		});

		gsap.fromTo(
			mapRef.current,
			{
				x: -30,
				y: -10,
				rotation: -20,
			},
			{
				x: 0,
				y: 190,
				rotation: 0,
				scrollTrigger: {
					trigger: mapRef.current,
					start: "bottom 90%",
					end: "bottom 25%",
					scrub: true,
					markers: false,
				},
			}
		);
	}, []);

	return (
		<div
			className={`relative bg-primary min-h-[80vh] flex items-center justify-center ${styles.box}`}
		>
			<div className="text-center text-neutral-content w-full overflow-hidden">
				<div className="flex flex-row min-w-[100vw] m-auto p-3">
					<div className="min-h-[80vh] w-[9%] flex flex-col-reverse"></div>
					<div className="min-h-[80vh] w-[46%] flex items-center justify-center">
						<img
							ref={imgRef}
							src={heroLogo}
							alt="Hero"
							className="max-w-full h-auto object-contain align-middle justify-center p-8"
						/>
					</div>
					<div className="min-h-[80vh] w-[31%] flex flex-col items-center justify-center">
						{/* <h1 className="text-3xl font-bold text-secondary font-poppins p-1">
							Welcome to Book Mate!
						</h1> */}
						<p className="text-xl text-accent font-montserrat font-medium text-justify p-1">
							Book Mate is the perfect way to find your next read and the person
							to read with! Finding individuals with the same taste as yourself
							has never been easier, thanks to our AI-powered match engine. So
							what are you waiting for!?
						</p>
						<div className="flex flex-row justify-center">
							<button className="btn btn-secondary m-2 font-poppins">
								Find Your Book Mate!
							</button>
						</div>
					</div>
					<div className="min-h-[80vh] w-[14%] flex flex-col-reverse items-center">
						<img
							ref={mapRef}
							src={map}
							alt="MapImg"
							className="max-w-full h-auto object-contain py-20 pr-6"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Hero;
