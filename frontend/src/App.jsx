/* eslint-disable no-unused-vars */
import "./App.css";
import { ThemeModeContext, useThemeMode } from "./theme/theme.js";
import { CssBaseline, ThemeProvider, Box, CircularProgress } from "@mui/material";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useRef, lazy, Suspense } from "react";
import UserProvider from "./pages/UserContext/UserContext.jsx";
import CookieConsent from "./components/CookieConsent.jsx";
import SiteFooter from "./components/SiteFooter.jsx";

const Layout = lazy(() => import("./Layout/Layout.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard.jsx"));
const Students = lazy(() => import("./pages/Students/Students.jsx"));
const Course = lazy(() => import("./pages/Course/Course.jsx"));
const Subjects = lazy(() => import("./pages/Subjects/Subjects.jsx"));
const Teachers = lazy(() => import("./pages/Teachers/Teachers.jsx"));
const Attendance = lazy(() => import("./pages/Attendance/Attendance.jsx"));
const PieChart = lazy(() => import("./pages/Charts/PieChart.jsx"));
const BarChart = lazy(() => import("./pages/Charts/BarChart.jsx"));
const LineChart = lazy(() => import("./pages/Charts/LineChart.jsx"));
const Login = lazy(() => import("./pages/Login/Login.jsx"));
const Register = lazy(() => import("./pages/Register/Register.jsx"));
const UpdateUser = lazy(() => import("./pages/UpdateUser/UpdateUser.jsx"));
const EmailVerification = lazy(() => import("./pages/EmailVerification/EmailVerification.jsx"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound.jsx"));
const Contact = lazy(() => import("./pages/Contact/Contact.jsx"));
const LegalPages = lazy(() => import("./pages/Legal/LegalPages.jsx"));
const ThankYou = lazy(() => import("./pages/ThankYou/ThankYou.jsx"));

const seoPages = {
  "/login": ["Sign in | CampSync", "Sign in to your CampSync academic workspace.", false],
  "/register": ["Create an account | CampSync", "Register a teacher account for CampSync.", false],
  "/privacy": ["Privacy Policy | CampSync", "Learn how CampSync handles account, academic and application information.", true],
  "/terms": ["Terms of Use | CampSync", "Read the terms for using the CampSync campus management application.", true],
  "/contact": ["Contact CampSync", "Contact the CampSync team with a question or enquiry.", true],
  "/support": ["CampSync Support", "Get help with CampSync and report an application issue.", true],
  "/thank-you": ["Thank you | CampSync", "Your CampSync request confirmation.", false],
  "/emailVerification": ["Email verification | CampSync", "Verify your CampSync account email address.", false],
};
function SeoManager() {
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname;
    const [title, description, indexable] = seoPages[path] || ["CampSync — Campus management made simpler", "A connected workspace for campus and academic coordination.", false];
    document.title = title;
    let descriptionTag = document.querySelector('meta[name="description"]');
    if (!descriptionTag) { descriptionTag = document.createElement("meta"); descriptionTag.name = "description"; document.head.appendChild(descriptionTag); }
    descriptionTag.content = description;
    let robotsTag = document.querySelector('meta[name="robots"]');
    if (!robotsTag) { robotsTag = document.createElement("meta"); robotsTag.name = "robots"; document.head.appendChild(robotsTag); }
    robotsTag.content = indexable ? "index, follow" : "noindex, nofollow";
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = "https://campsync.onrender.com" + (indexable ? path : "/login");
  }, [location.pathname]);
  return null;
}

function AnalyticsPageTracker() {
  const location = useLocation();
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    let consent = null;
    try { consent = localStorage.getItem("campsync-cookie-consent"); } catch {}
    if (consent === "accepted" && typeof window.gtag === "function") {
      window.gtag("event", "page_view", { page_path: location.pathname + location.search });
    }
  }, [location.pathname, location.search]);
  return null;
}

function RouteFallback() {
  return <Box role="status" aria-label="Loading page" sx={{ minHeight: "40vh", display: "grid", placeItems: "center" }}><CircularProgress size={28} /></Box>;
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
            <Suspense fallback={<RouteFallback />}>
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
            </Suspense>
            <SiteFooter />
          </BrowserRouter>
        </UserProvider>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
export default App;
