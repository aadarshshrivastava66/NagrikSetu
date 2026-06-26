import Categories from "../components/home/Categories";
import CTASection from "../components/home/CTASection";
import Features from "../components/home/Features";
import HeroSection from "../components/home/HeroSection";
import HowItWorks from "../components/home/HowItWorks";
import LiveTicker from "../components/home/LiveTicker";
import StatsBar from "../components/home/StatsBar";
import Testimonials from "../components/home/Testimonials";


const HomePage = () => (
  <>
    <HeroSection/>
    <StatsBar/>
    <LiveTicker/>
    <HowItWorks/>
    <Categories/>
    <Features/>
    <Testimonials/>
    <CTASection/>
  </>
);

export default HomePage;