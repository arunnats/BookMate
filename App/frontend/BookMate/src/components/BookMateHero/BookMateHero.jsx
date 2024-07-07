import React, { useEffect, useRef } from "react";
import reccLogo from "../../assets/images/matchmaker-logo.png";
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
			<div className="text-center text-neutral-content w-full overflow-hidden my-3">
				<div className="flex flex-row m-auto p-3">
					<div className=" w-[30%] flex items-center justify-center">
						<img
							ref={imgRef}
							src={reccLogo}
							alt="Hero"
							className="max-h-[50vh] object-contain align-middle justify-center p-5"
						/>
					</div>
					<div className=" w-[70%] flex flex-col items-center justify-center">
						<h1 className="text-secondary font-poppins font-bold text-4xl">
							Find your match!
						</h1>
						<p className="text-lg text-accent font-montserrat font-medium text-justify p-1">
							Find your next favorite book with our meticulous AI model, trained
							on over 1,149,000 ratings from over 278,000 users across the
							world! Simply choose a book you like and get curated results in an
							instant! Click on the book to view its information.
							<br />
							Don't know what to read next? Click on the Get Random Books button
							to get random book titles.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ReccInfo;
