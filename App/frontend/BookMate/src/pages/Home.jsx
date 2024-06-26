import React, { useContext, useState } from "react";
import Hero from "../components/Hero/Hero";
import ReccHero from "../components/RecommendationHero/RecommendationHero";
import UserProfile from "../components/UserProfile/UserProfile";

const Home = () => {
	return (
		<div>
			<Hero />
			<ReccHero />
		</div>
	);
};

export default Home;
