import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { bannerProducts } from "../../data/products";
import "./HeroBanner.css";

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % bannerProducts.length);
    }, 4000);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (idx) => {
    clearInterval(timerRef.current);
    setCurrent(idx);
    startTimer();
  };

  const prev = () => goTo((current - 1 + bannerProducts.length) % bannerProducts.length);
  const next = () => goTo((current + 1) % bannerProducts.length);

  return (
    <div className="hero-banner">
      <div className="hero-slides">
        {bannerProducts.map((banner, idx) => (
          <div
            key={banner.id}
            className={`hero-slide ${idx === current ? "active" : ""}`}
            style={{ background: banner.bg }}
          >
            <Link to={banner.link} className="hero-slide-inner">
              <img
                src={banner.image}
                alt={banner.title}
                className="hero-img"
                loading="lazy"
              />
              <div className="hero-overlay">
                <div className="hero-content">
                  <h2 className="hero-title">{banner.title}</h2>
                  <p className="hero-subtitle">{banner.subtitle}</p>
                  <button className="hero-cta">{banner.cta}</button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button className="hero-control hero-prev" onClick={prev} id="hero-prev-btn">
        <FiChevronLeft size={24} />
      </button>
      <button className="hero-control hero-next" onClick={next} id="hero-next-btn">
        <FiChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="hero-dots">
        {bannerProducts.map((_, idx) => (
          <button
            key={idx}
            className={`hero-dot ${idx === current ? "active" : ""}`}
            onClick={() => goTo(idx)}
            id={`hero-dot-${idx}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
