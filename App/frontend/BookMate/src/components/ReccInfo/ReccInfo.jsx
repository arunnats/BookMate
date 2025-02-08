import React, { useEffect, useRef } from "react";
import reccLogo from "../../assets/images/recc-image.png";
import gsap from "gsap";

const ReccInfo = () => {
	const imgRef = useRef(null);

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
	});

	return (
		<div className={`relative bg-primary  flex items-center justify-center `}>
			<div className="text-center text-neutral-content w-full overflow-hidden">
				<div className="flex flex-col md:flex-row min-w-[100vw] m-auto p-1 md:p-3">
					<div className=" max-w-[0%] md:max-w-[4%] flex flex-col-reverse"></div>
					<div className=" w-[80%] md:w-[36%] flex items-center justify-center mx-auto">
						<img
							ref={imgRef}
							src={reccLogo}
							alt="Hero"
							className="max-h-[35vh] md:max-h-[50vh] object-contain align-middle justify-center p-5"
						/>
					</div>
					<div className=" w-full md:w-[52%] flex flex-col items-center justify-center">
						<h1 className="text-secondary font-poppins font-bold text-3xl md:text-4xl 2xl:text-5xl ">
							Book Recommendations
						</h1>
						<p className="text-xl 2xl:text-2xl text-accent font-montserrat font-medium text-justify p-5 md:p-1">
							Find your next favorite book with our meticulous AI model, trained
							on over 1,149,000 ratings from over 278,000 users across the
							world! Simply choose a book you like and get curated results in an
							instant! Click on the book to view its information.
							<br />
							Don't know what to read next? Click on the Get Random Books button
							to get random book titles.
						</p>
					</div>
					<div className=" w-[0%] md:w-[8%] flex flex-col-reverse items-center"></div>
				</div>
			</div>
		</div>
	);
};

export default ReccInfo;
