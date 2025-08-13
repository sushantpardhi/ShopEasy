import "./Explore.css";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader/Loader";
import FullWidthSlider from "./Slider/Slider";
import hero1 from "../../assets/images/Banner/1.jpg";
import hero2 from "../../assets/images/Banner/2.jpg";
import hero3 from "../../assets/images/Banner/3.jpg";
import Content from "./Content/Content";

const slides = [
  {
    image: hero1,
    title: "Welcome to Our Site",
  },
  {
    image: hero2,
    title: "Discover Amazing Features",
  },
  {
    image: hero3,
    title: "Join Us Today",
  },
];

const Explore = () => {
  const [loading, setLoading] = useState(true); // Local loading state

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      console.log("Loading complete");
    }, 1000);

    return () => clearTimeout(timer); // Clean up
  }, []);

  return (
    <div className="home">
      {loading ? (
        <Loader />
      ) : (
        <main className="main-layout">
          {/* Hero Section with Slider */}
          <section className="hero-section">
            <FullWidthSlider slides={slides} />
          </section>

          {/* Main Content Section */}
          <section className="content-section">
            <Content />
          </section>
        </main>
      )}
    </div>
  );
};

export default Explore;
