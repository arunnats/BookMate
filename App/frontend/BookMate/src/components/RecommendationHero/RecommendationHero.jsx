import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import reccLogo from "../../assets/images/recc-image.png";

const ReccHero = () => {
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
	}, []);

	return (
		<div className={`relative min-h-[90vh] flex items-center justify-center`}>
			<div className="text-center text-neutral-content w-full">
				<div className="flex flex-row max-w-[80vw] m-auto p-4">
					<div className="min-h-[80vh] w-3/5 flex flex-col items-center justify-center">
						<h1 className="text-4xl font-bold text-white">
							Book Recommendation Model
						</h1>
						<p className="text-2xl text-white">
							Your one stop destination for all your book needs.
						</p>
						<div className="flex flex-row justify-center">
							<button className="btn btn-primary m-2">
								Get Recommendations
							</button>
						</div>
					</div>
					<div className="min-h-[80vh] w-2/5 flex items-center justify-center">
						<img
							ref={imgRef}
							src={reccLogo}
							alt="Hero"
							className="max-w-full h-auto object-contain align-middle justify-center p-10"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ReccHero;