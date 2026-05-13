import React, { useState, useEffect, useRef } from "react";
import "../components/Harbourside.css";

// --- Custom Hook for Scroll Reveal ---
const useScrollReveal = (threshold = 150) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-active");
          }
        });
      },
      { rootMargin: `0px 0px -${threshold}px 0px` },
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [threshold]);
  return ref;
};

// --- MOCK DATA (Replace with API/Database later) ---
const bookedDatesDB = [
  "2024-12-20",
  "2024-12-21",
  "2024-12-22",
  "2025-01-10",
  "2025-01-11",
];
const startDatesDB = ["2024-12-19", "2025-01-09"];
const endDatesDB = ["2024-12-23", "2025-01-12"];

const properties = [{ id: 1, property_name: "Harbourside 519" }];
const all_property_rates = [
  {
    property: { property_name: "Harbourside 519" },
    rates: [
      {
        season_name: "Standard",
        start_date: "2025-01-01",
        end_date: "2025-12-31",
        nightly_price: 250,
        weekend_price: 300,
        weekend_days: "Fri, Sat",
        weekly_discount: 10,
        min_stay: 3,
      },
      {
        season_name: "Spring Break",
        start_date: "2025-03-01",
        end_date: "2025-03-31",
        nightly_price: 350,
        weekend_price: 400,
        weekend_days: "Fri, Sat",
        weekly_discount: 5,
        min_stay: 5,
      },
    ],
  },
];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const RatesAndBooking: React.FC = () => {
  // Header States
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activePage = "rates-and-booking"; // Set active nav link

  // Calendar States
  const [calendarCurrentDate, setCalendarCurrentDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [checkInSelection, setCheckInSelection] = useState<Date | null>(null);
  const [checkOutSelection, setCheckOutSelection] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Effects
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calendar Helpers
  const formatDateStr = (date: Date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  };

  const generateCalendarRows = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const rows = [];
    let cells = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(<td key={`empty-${i}`}></td>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const dStr = formatDateStr(dateObj);
      let cls =
        dateObj < today
          ? "disabled-date"
          : dateObj.getTime() === today.getTime()
            ? "current-date-cell"
            : "";

      if (bookedDatesDB.includes(dStr)) cls += " booked-cell";
      if (startDatesDB.includes(dStr)) cls += " start-date-cell";
      if (endDatesDB.includes(dStr)) cls += " end-date-cell";
      if (checkInSelection && dateObj.getTime() === checkInSelection.getTime())
        cls += " selected-checkin";
      if (
        checkOutSelection &&
        dateObj.getTime() === checkOutSelection.getTime()
      )
        cls += " selected-checkout";

      cells.push(
        <td key={day} className={cls} onClick={() => handleDateClick(dateObj)}>
          {day}
        </td>,
      );

      if ((firstDay + day) % 7 === 0 || day === daysInMonth) {
        while (cells.length < 7 && day === daysInMonth) {
          cells.push(<td key={`empty-end-${day}-${cells.length}`}></td>);
        }
        rows.push(<tr key={day}>{cells}</tr>);
        cells = [];
      }
    }
    return rows;
  };

  const handleDateClick = (dateObj: Date) => {
    const dStr = formatDateStr(dateObj);
    if (
      dateObj < today ||
      bookedDatesDB.includes(dStr) ||
      startDatesDB.includes(dStr)
    )
      return;

    if (!checkInSelection || (checkInSelection && checkOutSelection)) {
      setCheckInSelection(dateObj);
      setCheckOutSelection(null);
    } else if (dateObj > checkInSelection) {
      let hasBooked = false;
      const temp = new Date(checkInSelection);
      while (temp <= dateObj) {
        const tStr = formatDateStr(temp);
        if (
          bookedDatesDB.includes(tStr) ||
          (startDatesDB.includes(tStr) &&
            temp.getTime() !== checkInSelection.getTime())
        ) {
          hasBooked = true;
          break;
        }
        temp.setDate(temp.getDate() + 1);
      }
      if (hasBooked) {
        alert("Overlaps with existing booking!");
        setCheckInSelection(null);
        return;
      }
      setCheckOutSelection(dateObj);
      setShowModal(true);
    }
  };

  const prevMonth = () =>
    setCalendarCurrentDate(
      new Date(
        calendarCurrentDate.getFullYear(),
        calendarCurrentDate.getMonth() - 1,
        1,
      ),
    );
  const nextMonth = () =>
    setCalendarCurrentDate(
      new Date(
        calendarCurrentDate.getFullYear(),
        calendarCurrentDate.getMonth() + 1,
        1,
      ),
    );
  const refreshCalendar = () => {
    setCheckInSelection(null);
    setCheckOutSelection(null);
  };

  let rY = calendarCurrentDate.getFullYear(),
    rM = calendarCurrentDate.getMonth() + 1;
  if (rM > 11) {
    rM = 0;
    rY++;
  }

  return (
    <>
      {/* ==================== HEADER ==================== */}
      <header id="mainHeader" className={isScrolled ? "header-active" : ""}>
        <a href="/" className="logo">
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
              <a href="/" className={activePage === "index" ? "active" : ""}>
                Home
              </a>
            </li>
            <li>
              <a
                href="/about"
                className={activePage === "about" ? "active" : ""}
              >
                About us
              </a>
            </li>
            <li>
              <a
                href="/gallery"
                className={activePage === "gallery" ? "active" : ""}
              >
                Gallery
              </a>
            </li>
            <li>
              <a
                href="/review"
                className={activePage === "review" ? "active" : ""}
              >
                Reviews
              </a>
            </li>
            <li>
              <a
                href="/rates-and-booking"
                className={activePage === "rates-and-booking" ? "active" : ""}
              >
                Rates And Booking
              </a>
            </li>
          </ul>
        </nav>
        <a href="/book" className="btn-book">
          BOOK NOW
        </a>
      </header>

      {/* ==================== RATES HERO ==================== */}
      <section className="gallery-hero">
        <div className="hero-content">
          <h1>Rates & Booking</h1>
        </div>
      </section>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="page-content">
        <div className="container">
          {/* Rates Section */}
          {all_property_rates.map((item, index) => (
            <div className="rates-table-wrap mb-5" key={index}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="section-title m-0">
                  {item.property.property_name} - Rates & Fees
                </h2>
                <a href="/getquote" className="btn btn-dark">
                  Reserve Now
                </a>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className="rates-table text-center shadow-sm">
                  <thead>
                    <tr style={{ backgroundColor: "#00afb9", color: "white" }}>
                      <th className="p-3" style={{ width: "30%" }}>
                        Start Date / End Date
                      </th>
                      <th className="p-3">Nightly</th>
                      <th className="p-3">Weekend Night</th>
                      <th className="p-3">Weekly</th>
                      <th className="p-3">Min Stay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.rates.map((r, rIdx) => {
                      const weekly_amt =
                        r.nightly_price * 7 * (1 - r.weekly_discount / 100);
                      const is_standard = r.season_name === "Standard";
                      return (
                        <tr
                          key={rIdx}
                          style={{
                            backgroundColor: is_standard
                              ? "#f2f2f2"
                              : "#ffffff",
                          }}
                        >
                          <td className="p-3">
                            <div className="fw-bold text-uppercase">
                              {r.season_name}
                            </div>
                            <div
                              className="text-muted"
                              style={{ fontSize: "13px" }}
                            >
                              {is_standard
                                ? "01/01/26 - 12/31/26"
                                : `${new Date(r.start_date).toLocaleDateString("en-US")} - ${new Date(r.end_date).toLocaleDateString("en-US")}`}
                            </div>
                          </td>
                          <td className="p-3">${r.nightly_price.toFixed(2)}</td>
                          <td className="p-3">
                            ${r.weekend_price.toFixed(2)}
                            <div
                              className="text-muted"
                              style={{ fontSize: "11px" }}
                            >
                              {r.weekend_days}
                            </div>
                          </td>
                          <td className="p-3">${weekly_amt.toFixed(2)}</td>
                          <td className="p-3">
                            {r.min_stay} Nights Minimum Stay
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {/* Availability Calendar */}
          <div className="availability-section mb-5">
            <h2 className="section-title mb-4">Availability</h2>
            <div className="calendar-container p-4">
              <div className="text-center mb-4">
                <p
                  className="fs-5 mb-3"
                  style={{ color: "#4a6ee0", fontWeight: 600 }}
                >
                  Note* Please click first on Checkin Date then Checkout Date
                  for booking.
                </p>
                <div className="d-flex justify-content-center flex-wrap gap-4 small text-uppercase">
                  <div>
                    <span className="legend-color current-date"></span> CURRENT
                    DATE
                  </div>
                  <div>
                    <span className="legend-color start-date"></span> START DATE
                  </div>
                  <div>
                    <span className="legend-color end-date"></span> END DATE
                  </div>
                  <div>
                    <span className="legend-color booked"></span> BOOKED
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <button className="btn-calendar" onClick={prevMonth}>
                  Prev
                </button>
                <button className="btn-calendar" onClick={refreshCalendar}>
                  Refresh
                </button>
                <button className="btn-calendar" onClick={nextMonth}>
                  Next
                </button>
              </div>
              <div className="row">
                <div className="col-lg-6 mb-3">
                  <div className="calendar-wrapper border">
                    <div className="calendar-header text-center">
                      {monthNames[calendarCurrentDate.getMonth()]},{" "}
                      {calendarCurrentDate.getFullYear()}
                    </div>
                    <table className="calendar-table text-center">
                      <thead>
                        <tr>
                          <th>Sun</th>
                          <th>Mon</th>
                          <th>Tue</th>
                          <th>Wed</th>
                          <th>Thu</th>
                          <th>Fri</th>
                          <th>Sat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {generateCalendarRows(
                          calendarCurrentDate.getFullYear(),
                          calendarCurrentDate.getMonth(),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="col-lg-6 mb-3">
                  <div className="calendar-wrapper border">
                    <div className="calendar-header text-center">
                      {monthNames[rM]}, {rY}
                    </div>
                    <table className="calendar-table text-center">
                      <thead>
                        <tr>
                          <th>Sun</th>
                          <th>Mon</th>
                          <th>Tue</th>
                          <th>Wed</th>
                          <th>Thu</th>
                          <th>Fri</th>
                          <th>Sat</th>
                        </tr>
                      </thead>
                      <tbody>{generateCalendarRows(rY, rM)}</tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ==================== BOOKING MODAL ==================== */}
      {showModal && (
        <div id="quoteModal" className="modal" style={{ display: "block" }}>
          <div className="modal-dialog shadow">
            <div className="modal-header bg-black py-2 d-flex justify-content-between p-3">
              <h5 className="modal-title m-0">Get Instant Quote</h5>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  color: "#fff",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                &times;
              </button>
            </div>
            <div className="modal-body bg-light-gray p-4">
              <form action="/getquote" method="POST">
                <div className="mb-3 d-none">
                  <select name="property" required>
                    {properties.map((prop, i) => (
                      <option key={i} value={prop.property_name}>
                        {prop.property_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="small fw-bold">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    required
                  />
                </div>
                <div className="row mb-3">
                  <div className="col-6">
                    <label className="small fw-bold">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="small fw-bold">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      required
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-6">
                    <label className="small fw-bold">Check In</label>
                    <input
                      type="text"
                      className="form-control"
                      name="checkin"
                      value={
                        checkInSelection ? formatDateStr(checkInSelection) : ""
                      }
                      readOnly
                    />
                  </div>
                  <div className="col-6">
                    <label className="small fw-bold">Check Out</label>
                    <input
                      type="text"
                      className="form-control"
                      name="checkout"
                      value={
                        checkOutSelection
                          ? `${formatDateStr(checkOutSelection)}:${Math.round((checkOutSelection.getTime() - checkInSelection!.getTime()) / 86400000)}`
                          : ""
                      }
                      readOnly
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-6">
                    <label className="small fw-bold">Guests</label>
                    <select className="form-select" name="guests">
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="small fw-bold">Pets</label>
                    <select className="form-select" name="pets">
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <button type="submit" className="btn btn-dark w-100 fw-bold">
                    GET QUOTE
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ==================== FOOTER ==================== */}
      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-column brand-col">
            <a href="/" className="footer-logo">
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
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/about">About us</a>
              </li>
              <li>
                <a href="/gallery">Gallery</a>
              </li>
              <li>
                <a href="/review">Reviews</a>
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
            <a href="/book" className="footer-cta-btn">
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
    </>
  );
};

export default RatesAndBooking;
