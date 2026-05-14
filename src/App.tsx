import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import HomePage from "./pages/HomePage/HomePage";
import RatesAndBookingPage from "./pages/RatesAndBookingPage/RatesAndBookingPage";
import "./index.css";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rates-and-booking" element={<RatesAndBookingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
