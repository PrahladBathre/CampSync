import { useContext, useState } from "react";
import { ThemeModeContext } from "../../theme/theme.js";
import { Box, IconButton, Tooltip, useTheme } from "@mui/material";
import Person4OutlinedIcon from "@mui/icons-material/Person4Outlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import NotificationPanel from "./Notification/NotificationPanel.jsx";
import UserProfilePanel from "./User profile/UserProfilePanel.jsx";

const TopBar = () => {
  const theme = useTheme();
  const colorMode = useContext(ThemeModeContext);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const profileHandler = (event) => setAnchorEl((current) => current ? null : event.currentTarget);
  const profileOpen = Boolean(anchorEl);
  return <Box sx={{ position: "relative", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 1, px: 2, py: 1.5, width: "100%", boxSizing: "border-box" }}>
    <Tooltip arrow title={theme.palette.mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}><IconButton aria-label="Toggle color theme" onClick={colorMode.toggleColorMode}>{theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}</IconButton></Tooltip>
    <Tooltip arrow title="Notifications"><IconButton aria-label="Toggle notifications" onClick={() => setNotificationOpen((v) => !v)}><NotificationsOutlinedIcon /></IconButton></Tooltip>
    <Tooltip arrow title="Account menu"><IconButton aria-label="Open account menu" onClick={profileHandler}><Person4OutlinedIcon /></IconButton></Tooltip>
    {isNotificationOpen && <Box sx={{ position: "absolute", zIndex: 1300, right: 56, top: "100%", minWidth: 280 }}><NotificationPanel /></Box>}
    {anchorEl && <UserProfilePanel id={profileOpen ? "account-menu" : undefined} handleClick={() => setAnchorEl(null)} open={profileOpen} pop={anchorEl} />}
  </Box>;
};
export default TopBar;
