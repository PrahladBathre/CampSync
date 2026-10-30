import React, { useState, useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";
import Bar from "../pages/Bars/Bar.jsx";
import TopBar from "../pages/Bars/TopBar.jsx";
import { UserContext } from "../pages/UserContext/UserContext.jsx";
import "../App.css";

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === "/";
  const { user, loadingUser, sessionError, retrySession } = useContext(UserContext);

  if (loadingUser) {
    return <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", gap: 1 }}>
      <Box sx={{ display: "grid", justifyItems: "center", gap: 1 }}>
        <CircularProgress aria-label="Restoring your session" />
        <Typography color="text.secondary" variant="body2">Connecting to CampSync…</Typography>
      </Box>
    </Box>;
  }

  if (sessionError) {
    return <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 2 }}>
      <Box sx={{ width: "100%", maxWidth: 480 }}>
        <Alert severity="warning">{sessionError}</Alert>
        <Button variant="contained" onClick={retrySession} sx={{ mt: 2 }}>Try again</Button>
      </Box>
    </Box>;
  }

  if (!user) return <Navigate to="/login" replace />;

  return <div className="app" style={{ display: "flex", maxWidth: "100vw", minHeight: "100vh" }}>
    <Bar collapsed={collapsed} setCollapsed={setCollapsed} />
    <main className={isDashboard ? "content dashboard-content" : "content page-content"} style={{ flex: 1, minWidth: 0, marginLeft: collapsed ? "65px" : "0px", transition: "margin-left 0.3s ease", padding: "clamp(10px, 1.5vw, 20px)", overflowX: "hidden" }}>
      <TopBar /><Outlet />
    </main>
  </div>;
};
export default Layout;
