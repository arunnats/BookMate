import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import reccLogo from "../../assets/images/recc-image.png";
import handR from "../../assets/images/handR.png";
import handL from "../../assets/images/handL.png";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const ReccHero = () => {
	const imgRef = useRef(null);
	const sideImgR = useRef(null);
	const sideImgL = useRef(null);

	useEffect(() => {
		const tl = gsap.timeline({
			repeat: -1,
			yoyo: true,
			onRepeat: () => {
				tl.invalidate();
			},
		});

		tl.to(imgRef.current, {
			rotate: "-.8",
			duration: 1.25,
			ease: "none",
			y: 1,
			x: -1,
		}).to(imgRef.current, {
			rotate: ".8",
			duration: 1.25,
			ease: "none",
			y: -1,
			x: 1,
		});

		gsap.fromTo(
			sideImgR.current,
			{
				x: 120,
				y: 0,
				rotation: 40,
			},
			{
				x: 0,
				y: 0,
				rotation: 0,
				scrollTrigger: {
					trigger: sideImgR.current,
					start: "top 85%",
					end: "top 20%",
					scrub: true,
					markers: false,
				},
			}
		);

		gsap.fromTo(
			sideImgL.current,
			{
				x: -120,
				y: 0,
				rotation: -40,
			},
			{
				x: 0,
				y: 0,
				rotation: 0,
				scrollTrigger: {
					trigger: sideImgL.current,
					start: "top 85%",
					end: "top 55%",
					scrub: true,
					markers: false,
				},
			}
		);
	}, []);

	return (
		<div
			className={`relative md:min-h-[90vh] flex items-center justify-center`}
		>
			<div className="text-center text-neutral-content w-full overflow-hidden">
				<div className="flex flex-col-reverse md:flex-row m-auto py-4">
					<div className=" w-[10%] hidden md:flex flex-col-reverse">
						<img
							ref={sideImgL}
							src={handL}
							alt="Hero"
							className="max-w-full h-auto object-contain py-20 pr-4"
						/>
					</div>
					<div className=" sm:w-full md:w-[48%] flex flex-col items-center justify-center p-1">
						<h1 className="text-3xl md:text-4xl 2xl:text-5xl font-bold text-primary font-poppins p-1">
							Book Recommendations
						</h1>
						<p className="text-xl 2xl:text-2xl text-white font-montserrat font-medium text-justify p-5 md:p-1">
							Find your next favorite book with our meticulous AI model, trained
							on over 1,149,000 ratings from over 278,000 users across the
							world! Simply choose a book you like and get curated results in an
							instant!
						</p>
						<div className="flex flex-row justify-center">
							<Link
								className="btn btn-secondary m-2 font-poppins"
								to="/recommendations"
							>
								Get Recommendations!
							</Link>
						</div>
					</div>
					<div className="sm:w-full md:w-[32%] flex items-center justify-center">
						<img
							ref={imgRef}
							src={reccLogo}
							alt="Hero"
							className=" max-w-full h-auto object-contain align-middle justify-center px-24 md:p-10"
						/>
					</div>
					<div className=" w-[10%] hidden md:flex flex-col">
						<img
							ref={sideImgR}
							src={handR}
							alt="Hero"
							className="max-w-full h-auto object-contain py-8 pl-4"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ReccHero;
