import React, { useContext, useState } from "react";
import Hero from "../components/Hero/Hero";
import ReccHero from "../components/RecommendationHero/RecommendationHero";
import MatchHero from "../components/MatchHero/MatchHero";

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
