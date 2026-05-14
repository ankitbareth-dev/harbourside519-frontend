import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./RatesAndBookingPage.css";

// --- MOCK DATA FOR CALENDAR (Keep until Bookings API is built) ---
const bookedDatesDB = [
  "2024-12-20",
  "2024-12-21",
  "2024-12-22",
  "2025-01-10",
  "2025-01-11",
];
const startDatesDB = ["2024-12-19", "2025-01-09"];
const endDatesDB = ["2024-12-23", "2025-01-12"];

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

// --- Type Definitions for API Data ---
interface Rate {
  id: number;
  season_name: string;
  start_date: string | null;
  end_date: string | null;
  nightly_price: number;
  weekend_price: number;
  weekend_days: string;
  min_stay: number;
  weekly_price: number | null;
  monthly_price: number | null;
}

const RatesAndBookingPage: React.FC = () => {
  // API States (Removed propertyInfo state)
  const [ratesData, setRatesData] = useState<Rate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Calendar States
  const [calendarCurrentDate, setCalendarCurrentDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [checkInSelection, setCheckInSelection] = useState<Date | null>(null);
  const [checkOutSelection, setCheckOutSelection] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // --- FETCH DATA FROM API ---
  useEffect(() => {
    const fetchRates = async () => {
      try {
        // Fixed backticks in URL
        const response = await fetch("http://localhost:5000/api/rates");
        if (!response.ok) throw new Error("Failed to fetch rates");

        const data = await response.json();
        if (data.success) {
          setRatesData(data.seasonal_rates); // Only setting rates now
        }
      } catch (error) {
        console.error("Error fetching rates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRates();
  }, []);

  // --- HELPERS ---
  const formatDateStr = (date: Date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  };

  // Formats YYYY-MM-DD to mm/dd/yyyy safely without timezone shifts
  const formatDisplayDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr + "T00:00:00");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const generateCalendarRows = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const rows: React.ReactNode[] = [];
    let cells: React.ReactNode[] = [];

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Quote request submitted! We will get back to you shortly.");
    setShowModal(false);
    setCheckInSelection(null);
    setCheckOutSelection(null);
  };

  return (
    <>
      <Header />

      {/* ==================== RATES HERO ==================== */}
      <section className="rates-hero">
        <div className="hero-content">
          <h1>Rates & Booking</h1>
        </div>
      </section>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="page-content">
        <div className="container">
          {/* Rates Section */}
          <div className="rates-table-wrap mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              {/* Hardcoded property name since we removed the properties table */}
              <h2 className="section-title m-0">
                Harbourside519 - Rates & Fees
              </h2>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="rates-table text-center shadow-sm">
                <thead>
                  <tr style={{ backgroundColor: "#00afb9", color: "white" }}>
                    <th className="p-3" style={{ width: "30%" }}>
                      Season / Dates
                    </th>
                    <th className="p-3">Nightly</th>
                    <th className="p-3">Weekend Night</th>
                    <th className="p-3">Weekly (6 Nts)</th>
                    <th className="p-3">Monthly (29 Nts)</th>
                    <th className="p-3">Min Stay</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center">
                        Loading rates...
                      </td>
                    </tr>
                  ) : ratesData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center">
                        No rates available at the moment.
                      </td>
                    </tr>
                  ) : (
                    ratesData.map((r, rIdx) => {
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
                              {r.start_date && r.end_date
                                ? `${formatDisplayDate(r.start_date)} - ${formatDisplayDate(r.end_date)}`
                                : "Applies when no seasonal dates match"}
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
                          {/* Using dynamically calculated prices from backend */}
                          <td className="p-3">
                            {r.weekly_price
                              ? `$${r.weekly_price.toFixed(2)}`
                              : "-"}
                          </td>
                          <td className="p-3">
                            {r.monthly_price
                              ? `$${r.monthly_price.toFixed(2)}`
                              : "-"}
                          </td>
                          <td className="p-3">
                            {r.min_stay} Nights Minimum Stay
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

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
                  fontSize: "20px",
                }}
              >
                &times;
              </button>
            </div>
            <div className="modal-body bg-light-gray p-4">
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3 d-none">
                  <select name="property" required>
                    {/* Hardcoded property name here too */}
                    <option value="Harbourside519">Harbourside519</option>
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
                        checkInSelection
                          ? formatDisplayDate(formatDateStr(checkInSelection))
                          : ""
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
                          ? `${formatDisplayDate(formatDateStr(checkOutSelection))}:${Math.round((checkOutSelection.getTime() - checkInSelection!.getTime()) / 86400000)}`
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

      <Footer />
    </>
  );
};

export default RatesAndBookingPage;
