import React, { useState, useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import Bar from "../pages/Bars/Bar.jsx";
import TopBar from "../pages/Bars/TopBar.jsx";
import { UserContext } from "../pages/UserContext/UserContext.jsx";
import "../App.css";

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === "/";
  const { user, loadingUser } = useContext(UserContext);
  if (loadingUser) return <Box sx={{minHeight:"100vh",display:"grid",placeItems:"center"}}><CircularProgress aria-label="Restoring your session"/></Box>;
  if (!user) return <Navigate to="/login" replace />;
  return <div className="app" style={{display:"flex",maxWidth:"100vw",minHeight:"100vh"}}>
    <Bar collapsed={collapsed} setCollapsed={setCollapsed}/>
    <main className={isDashboard ? "content dashboard-content" : "content page-content"} style={{flex:1,minWidth:0,marginLeft:collapsed?"65px":"0px",transition:"margin-left 0.3s ease",padding:"clamp(10px, 1.5vw, 20px)",overflowX:"hidden"}}>
      <TopBar/><Outlet/>
    </main>
  </div>;
};
export default Layout;
