/* eslint-disable no-unused-vars */
import "./App.css";
import { ThemeModeContext, useThemeMode } from "./theme/theme.js";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./Layout/Layout.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Students from "./pages/Students/Students.jsx";
import Course from "./pages/Course/Course.jsx";
import Subjects from "./pages/Subjects/Subjects.jsx";
import Teachers from "./pages/Teachers/Teachers.jsx";
import Attendance from "./pages/Attendance/Attendance.jsx";
import PieChart from "./pages/Charts/PieChart.jsx";
import BarChart from "./pages/Charts/BarChart.jsx";
import LineChart from "./pages/Charts/LineChart.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import UserProvider from "./pages/UserContext/UserContext.jsx";
import UpdateUser from "./pages/UpdateUser/UpdateUser.jsx";
import EmailVerification from "./pages/EmailVerification/EmailVerification.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import Contact from "./pages/Contact/Contact.jsx";
import LegalPages from "./pages/Legal/LegalPages.jsx";
import ThankYou from "./pages/ThankYou/ThankYou.jsx";
import CookieConsent from "./components/CookieConsent.jsx";
import SiteFooter from "./components/SiteFooter.jsx";

function AnalyticsPageTracker() {
  const location = useLocation();
  useEffect(() => {
    let consent = null;
    try { consent = localStorage.getItem("campsync-cookie-consent"); } catch {}
    if (consent === "accepted" && typeof window.gtag === "function") {
      window.gtag("event", "page_view", { page_path: location.pathname + location.search });
    }
  }, [location.pathname, location.search]);
  return null;
}

function App() {
  const [theme, colorMode] = useThemeMode();
  return (
    <ThemeModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <UserProvider>
          <CssBaseline />
          <BrowserRouter>
            <CookieConsent />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/emailVerification" element={<EmailVerification />} />
              <Route path="/privacy" element={<LegalPages type="privacy" />} />
              <Route path="/terms" element={<LegalPages type="terms" />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/support" element={<Contact support />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="student" element={<Students />} />
                <Route path="course" element={<Course />} />
                <Route path="subject" element={<Subjects />} />
                <Route path="teacher" element={<Teachers />} />
                <Route path="attendance" element={<Attendance />} />
                <Route path="barchart" element={<BarChart />} />
                <Route path="piechart" element={<PieChart />} />
                <Route path="linechart" element={<LineChart />} />
                <Route path="UpdateUser" element={<UpdateUser />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
            <SiteFooter />
          </BrowserRouter>
        </UserProvider>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
export default App;
