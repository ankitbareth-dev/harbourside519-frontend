import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import useScrollReveal from "../../hooks/useScrollReveal";
import "./HomePage.css";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Hero Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroSlides = [
    { id: 1, bg: "./image/i1.png" },
    { id: 2, bg: "./image/i12.png" },
    { id: 3, bg: "./image/i3.png" },
  ];

  // Hero Slider Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Scroll Reveal Refs
  const aboutRef = useScrollReveal(150);
  const galleryRef = useScrollReveal(100);

  // Navigation Handler
  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <Header />

      {/* ==================== HERO ==================== */}
      <section className="hero">
        <div className="hero-slider">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`slide ${index === currentSlide ? "active" : ""}`}
              style={{ backgroundImage: `url('${slide.bg}')` }}
            ></div>
          ))}
        </div>

        <div className="hero-content">
          <h1>Experience Pure Serenity</h1>
          <p>Where world-class luxury meets the thrill of the waves.</p>
          <div className="hero-btns">
            <a
              href="/gallery"
              className="btn-primary"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("/gallery");
              }}
            >
              Explore Waterpark
            </a>
            <a
              href="/book"
              className="btn-primary"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("/book");
              }}
            >
              Stay With Us
            </a>
          </div>
        </div>
      </section>

      {/* ==================== ABOUT PROPERTY ==================== */}
      <section className="about-property" ref={aboutRef}>
        <div className="about-text">
          <span>A Sanctuary of Joy</span>
          <h2 style={{ fontSize: "48px" }}>About the property</h2>
          <h3>
            This condo is at Harbourside Waterpark located on the intercoastal
            waterway.
          </h3>
          <p>
            This is a 2 bedroom, 2 bath unit (1110 Sq. Ft) that has enough room
            to sleep 8-10 people as it has a sleeper sofa for the extra large
            group. The master bedroom has a king size bed and a 55" 4K TV. The
            guest bedroom has a queen and a bunk bed with a trundle that sleeps
            three kids! The lower bed is a full size, the upper bed is a twin
            size and it has a trundle unit which is also a twin size. This unit
            has a full functional kitchen and a balcony that overlooks the
            intracoastal waterway. Sit back and watch the dolphins and boats
            cruise by or visit the 6th and 7th floor decks to watch the
            beautiful sunsets in the Gulf of Mexico. You are a short two block
            walk to the beach.
          </p>
          <a
            href="/about"
            className="btn-primary"
            style={{
              color: "#1a1a1a",
              borderColor: "#c5a059",
              padding: "12px 30px",
              textDecoration: "none",
              display: "inline-block",
              fontWeight: 600,
              transition: "0.3s",
            }}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("/about");
            }}
          >
            Learn More
          </a>
        </div>

        <div className="about-images">
          <div
            className="img-large"
            style={{ backgroundImage: "url('./image/i1.png')" }}
          ></div>
          <div
            className="img-small"
            style={{ backgroundImage: "url('./image/i5.png')" }}
          ></div>
        </div>
      </section>

      {/* ==================== GALLERY ==================== */}
      <section className="gallery-section" ref={galleryRef}>
        <div className="gallery-header">
          <p>Visual Journey</p>
          <h2 style={{ fontSize: "48px" }}>Capturing Moments</h2>
        </div>

        <div className="gallery-grid">
          <div className="gallery-item item-tall">
            <a
              href="/gallery"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("/gallery");
              }}
            >
              <img src="./image/i1.png" alt="" />
              <div className="item-overlay">
                <h3>All Photos</h3>
              </div>
            </a>
          </div>

          <div className="gallery-item item-wide">
            <a
              href="/gallery"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("/gallery");
              }}
            >
              <img src="./image/i19.png" alt="Water Slides" />
              <div className="item-overlay">
                <h3>Water Activities</h3>
              </div>
            </a>
          </div>

          <div className="gallery-item">
            <a
              href="/gallery"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("/gallery");
              }}
            >
              <img src="./image/i17.png" alt="" />
              <div className="item-overlay">
                <h3>What's Nearby</h3>
              </div>
            </a>
          </div>

          <div className="gallery-item">
            <a
              href="/gallery"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("/gallery");
              }}
            >
              <img src="./image/i15.png" alt="" />
              <div className="item-overlay">
                <h3>Common Area</h3>
              </div>
            </a>
          </div>

          <div className="gallery-item item-wide">
            <a
              href="/gallery"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("/gallery");
              }}
            >
              <img src="./image/i3.png" alt="" />
              <div className="item-overlay">
                <h3>The Stay</h3>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ==================== AMENITIES ==================== */}
      <section className="amenities-section">
        <div className="amenities-header">
          <span>The Experience</span>
          <h2>World-Class Amenities</h2>
        </div>

        <div className="amenities-grid">
          <div className="amenity-card">
            <div className="icon-box">
              <i className="fa-solid fa-water"></i>
            </div>
            <h4>Ocean View</h4>
          </div>
          <div className="amenity-card">
            <div className="icon-box">
              <i className="fa-solid fa-swimming-pool"></i>
            </div>
            <h4>Pool Access</h4>
          </div>
          <div className="amenity-card">
            <div className="icon-box">
              <i className="fa-solid fa-soap"></i>
            </div>
            <h4>Washer</h4>
          </div>
          <div className="amenity-card">
            <div className="icon-box">
              <i className="fa-solid fa-wind"></i>
            </div>
            <h4>Dryer</h4>
          </div>
          <div className="amenity-card">
            <div className="icon-box">
              <i className="fa-solid fa-snowflake"></i>
            </div>
            <h4>Air Conditioning</h4>
          </div>
          <div className="amenity-card">
            <div className="icon-box">
              <i className="fa-solid fa-umbrella-beach"></i>
            </div>
            <h4>Outdoor Space</h4>
          </div>
          <div className="amenity-card">
            <div className="icon-box">
              <i className="fa-solid fa-car"></i>
            </div>
            <h4>Parking Available</h4>
          </div>
          <div className="amenity-card">
            <div className="icon-box">
              <i className="fa-solid fa-wifi"></i>
            </div>
            <h4>Hi-Speed Wifi</h4>
          </div>
        </div>

        <a
          href="/amenities"
          className="explore-link"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("/amenities");
          }}
        >
          Explore All Amenities &rsaquo;
        </a>
      </section>

      {/* ==================== LOCATION ==================== */}
      <section className="location-area">
        <div className="location-container">
          <div className="location-content">
            <div className="location-header">
              <span className="subtitle">Explore the Area</span>
              <h2 className="section-title">Indian Rocks Beach</h2>
              <p className="description">
                Located in Indian Rocks Beach, this condo is near theme parks
                and on the waterfront. Shoppers can check out John's Pass
                Village & Boardwalk, while everyone can enjoy the natural beauty
                of St. Petersburg - Clearwater Beaches and Sand Key Park. Splash
                Harbour Water Park and Smugglers Cove Adventure Golf are also
                worth visiting. Be sure to check out the area's animals with
                activities such as game walks and birdwatching.
              </p>
            </div>

            <div className="info-sidebar">
              <div className="info-card">
                <h3>
                  <i className="fas fa-map-marker-alt"></i> What's Nearby
                </h3>
                <ul className="info-list">
                  <li>
                    <span>Splash Harbour Water Park</span>
                    <span>2 min walk</span>
                  </li>
                  <li>
                    <span>Clearwater Beaches</span> <span>3 min walk</span>
                  </li>
                  <li>
                    <span>John R. Bonner Nature Park</span>
                    <span>1 min drive</span>
                  </li>
                </ul>
              </div>

              <div className="info-card">
                <h3>
                  <i className="fas fa-utensils"></i> Fine Dining
                </h3>
                <ul className="info-list">
                  <li>
                    <span>Vip Mexican Restaurant</span> <span>4 min walk</span>
                  </li>
                  <li>
                    <span>PJ's Oyster Bar</span> <span>3 min walk</span>
                  </li>
                  <li>
                    <span>Goose's Sports Bar</span> <span>3 min drive</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="map-wrapper">
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3527.135260124803!2d-82.8502573!3d27.8814578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDUyJzUzLjMiTiA4MsKwNTEnMDEuMCJX!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Location Map"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== HOST ==================== */}
      <section className="premium-host-section">
        <div className="host-grid">
          <div className="host-sidebar">
            <h2
              className="section-title"
              style={{ fontFamily: "Playfair Display" }}
            >
              About the host
            </h2>
            <div className="host-profile-sm">
              <img
                src="./image/o.png"
                alt="James Gordon"
                className="host-avatar-sm"
              />
              <div className="host-info">
                <span className="label">Hosted by</span>
                <h3 className="host-name">James Gordon</h3>
              </div>
            </div>

            <div className="badge-card">
              <div className="badge-icon">★</div>
              <div className="badge-text">
                <strong>Premier Host</strong>
                <p>Consistently provides great experiences</p>
              </div>
            </div>

            <div className="meta-info">
              <strong>Languages:</strong> English
            </div>
          </div>

          <div className="host-main-content">
            <div className="content-block">
              <p className="intro-text">
                Born and raised in Indiana, we have a family of seven children
                from the ages of 2 to 30. We love Florida and the Indian Rocks
                Beach area, so we decided to invest in a place we could
                occasionally visit.
              </p>
            </div>

            <div className="content-block">
              <h4>Why they chose this property</h4>
              <p>
                We live in Indiana and have been traveling to the Indian Shores
                area for 5 years. This property was a perfect fit; young kids
                enjoy the water park, we love the lazy river, and our teenager
                can walk to the beach. It is the PERFECT location.
              </p>
            </div>

            <div className="content-block">
              <h4>What makes this property unique</h4>
              <ul className="amenities-list">
                <li>4 FREE Water Park Passes daily ($100 value)</li>
                <li>Balcony view of the intercostal waterway</li>
                <li>Margaritaville Frozen Concoction Maker</li>
                <li>2 block walk to the beach</li>
                <li>Access to 6th and 7th floor rooftop deck</li>
                <li>Full size laundry washer and dryer</li>
                <li>Toddler/children friendly</li>
                <li>Making memories for a lifetime :)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HomePage;
