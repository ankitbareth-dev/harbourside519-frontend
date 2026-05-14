import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <header id="mainHeader" className={isScrolled ? "header-active" : ""}>
      <a
        href="/"
        className="logo"
        onClick={(e) => {
          e.preventDefault();
          handleNavClick("/");
        }}
      >
        HARBOURSIDE519
      </a>

      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <nav id="navbar" className={menuOpen ? "active" : ""}>
        <ul>
          <li>
            <a
              href="/"
              className={location.pathname === "/" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("/");
              }}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="/about"
              className={location.pathname === "/about" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("/about");
              }}
            >
              About us
            </a>
          </li>
          <li>
            <a
              href="/gallery"
              className={location.pathname === "/gallery" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("/gallery");
              }}
            >
              Gallery
            </a>
          </li>
          <li>
            <a
              href="/review"
              className={location.pathname === "/review" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("/review");
              }}
            >
              Reviews
            </a>
          </li>
          <li>
            <a
              href="/rates-and-booking"
              className={
                location.pathname === "/rates-and-booking" ? "active" : ""
              }
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("/rates-and-booking");
              }}
            >
              Rates And Booking
            </a>
          </li>
        </ul>
      </nav>

      <a
        href="/book"
        className="btn-book"
        onClick={(e) => {
          e.preventDefault();
          handleNavClick("/book");
        }}
      >
        BOOK NOW
      </a>
    </header>
  );
};

export default Header;
