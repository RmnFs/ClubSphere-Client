import Hero from "./home/Hero";
import FeaturedClubs from "./home/FeaturedClubs";
import HowItWorks from "./home/HowItWorks";

const Home = () => {
    return (
        <div className="min-h-screen pb-12">
            <Hero />
            <div className="container mx-auto px-4">
                <FeaturedClubs />
                <HowItWorks />
            </div>
        </div>
    );
};

export default Home;
