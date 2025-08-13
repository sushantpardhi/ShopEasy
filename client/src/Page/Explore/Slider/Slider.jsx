import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Slider.css'

const FullWidthSlider = ({ slides }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        pauseOnHover: true,
        fade: true, // Smoother transition
        cssEase: 'ease-in-out',
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false, // Hide arrows on mobile for better UX
                    dots: true,
                }
            }
        ]
    };

    return (
        <div className="slider-container">
            <Slider {...settings}>
                {slides.map((slide, index) => (
                    <div key={index} className="slide-wrapper">
                        <div className="slide-image-wrapper">
                            <img
                                src={slide.image}
                                alt={slide.title || `Slide ${index + 1}`}
                                className="slide-image"
                                loading={index === 0 ? "eager" : "lazy"}
                            />
                            {slide.title && (
                                <div className="slide-overlay">
                                    <h3 className="slide-title">
                                        {slide.title}
                                    </h3>
                                    {slide.description && (
                                        <p className="slide-description">
                                            {slide.description}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

const NextArrow = ({ onClick }) => (
    <button
        className="custom-arrow next-arrow"
        onClick={onClick}
        aria-label="Next slide"
        type="button"
    >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    </button>
);

const PrevArrow = ({ onClick }) => (
    <button
        className="custom-arrow prev-arrow"
        onClick={onClick}
        aria-label="Previous slide"
        type="button"
    >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    </button>
);

export default FullWidthSlider;
