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
		<div className={`relative bg-primary flex items-center justify-center `}>
			<div className="text-center text-neutral-content w-full overflow-hidden">
				<div className="flex flex-col md:flex-row m-auto p-3 pt-0">
					<div className=" w-full md:w-[34%] flex items-center justify-center">
						<img
							ref={imgRef}
							src={reccLogo}
							alt="Hero"
							className="max-h-[45h] object-contain align-middle justify-center p-5"
						/>
					</div>
					<div className="w-full md:w-[66%] flex flex-col ">
						<p className="text-lg md:text-xl 2xl:text-2xl text-accent font-montserrat font-semibold text-justify p-3 pt-3 my-auto">
							Find someone who shares a similar reading profile by adding three
							or more of your favorite books to your library and taking the
							questionnaire and make sure you opt in. Leave the rest to us!
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ReccInfo;
