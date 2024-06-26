import React, { useContext, useState } from "react";
import Hero from "../components/Hero/Hero";
import ReccHero from "../components/RecommendationHero/RecommendationHero";
import MatchHero from "../components/MatchHero/MatchHero";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const Home = () => {
	return (
		<div>
			<Hero />
			<ReccHero />
			<MatchHero />
		</div>
	);
};

export default Home;
