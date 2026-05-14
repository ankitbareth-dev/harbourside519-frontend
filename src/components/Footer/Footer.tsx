import React from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-column brand-col">
          <a
            href="/"
            className="footer-logo"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("/");
            }}
          >
            HARBOURSIDE519
          </a>
          <p>
            Where world-class luxury meets the thrill of the waves. Experience
            the ultimate waterfront retreat at Indian Rocks Beach.
          </p>
          <div className="social-links">
            <a href="#">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#">
              <i className="fab fa-pinterest"></i>
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h4>Explore</h4>
          <ul>
            <li>
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("/");
                }}
              >
                Home
              </a>
            </li>
            <li>
              <a href="#">About us</a>
            </li>
            <li>
              <a href="#">Gallery</a>
            </li>
            <li>
              <a href="#">Reviews</a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Contact Us</h4>
          <div className="contact-item">
            <i className="fas fa-map-marker-alt"></i>
            <span>Harbourside Condo, Indian Rocks Beach, FL 33785</span>
          </div>
          <div className="contact-item">
            <i className="fas fa-phone"></i>
            <span>+1-419-205-1435</span>
          </div>
          <div className="contact-item">
            <i className="fas fa-envelope"></i>
            <span>jgordon101365@Gmail.Com</span>
          </div>
        </div>

        <div className="footer-column booking-col">
          <h4>Plan Your Stay</h4>
          <p>
            Ready for an unforgettable escape? Check our seasonal availability
            and rates.
          </p>
          <a
            href="/rates-and-booking"
            className="footer-cta-btn"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("/rates-and-booking");
            }}
          >
            Check Availability <i className="fas fa-calendar-alt"></i>
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 HARBOURSIDE519 Resort. All rights reserved.</p>
        <p className="designer-tag">
          Designed by <span>PREMIUM BUSINESS WEBSITES</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
