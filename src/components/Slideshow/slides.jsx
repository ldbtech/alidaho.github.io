import React, { useState } from "react";
import './slides.css'

const SlideShow = ({ props }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prevSlide) => prevSlide === props.length - 1 ? 0 : prevSlide + 1);
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) => prevSlide === 0 ? props.length - 1 : prevSlide - 1);
    };

    return (
        <div className="slideshow-container">
            {images.map((image, index) => (
                <div
                    key={index}
                    className={`slide ${index === currentSlide ? "active" : ""}`}
                >
                    <img src={image} alt={`Slide ${index + 1}`} />
                </div>
            ))}

            <button className="prev" onClick={prevSlide}>
                &#10094;
            </button>
            <button className="next" onClick={nextSlide}>
                &#10095;
            </button>
        </div>
    )
};

export default SlideShow;

