import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HarboursidePage from "./components/HarboursidePage";
import RatesAndBooking from "./pages/RatesAndBooking"; // Adjust path if you saved it in /pages

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page Route */}
        <Route path="/" element={<HarboursidePage />} />

        {/* Rates & Booking Page Route */}
        <Route path="/rates-and-booking" element={<RatesAndBooking />} />

        {/* You can add more routes here later for /about, /gallery, etc. */}
      </Routes>
    </Router>
  );
}

export default App;
