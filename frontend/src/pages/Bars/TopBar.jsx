import { useContext, useState } from "react";
import { ThemeModeContext } from "../../theme/theme.js";
import { Box, IconButton, Tooltip, useTheme } from "@mui/material";
import { UserRound, Sun, Moon, Bell } from "lucide-react";
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
    <Tooltip arrow title={theme.palette.mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}><IconButton aria-label="Toggle color theme" onClick={colorMode.toggleColorMode}>{theme.palette.mode === "dark" ? <Moon size={19} strokeWidth={1.8} /> : <Sun size={19} strokeWidth={1.8} />}</IconButton></Tooltip>
    <Tooltip arrow title="Notifications"><IconButton aria-label="Toggle notifications" onClick={() => setNotificationOpen((v) => !v)}><Bell size={19} strokeWidth={1.8} /></IconButton></Tooltip>
    <Tooltip arrow title="Account menu"><IconButton aria-label="Open account menu" onClick={profileHandler}><UserRound size={19} strokeWidth={1.8} /></IconButton></Tooltip>
    {isNotificationOpen && <Box sx={{ position: "absolute", zIndex: 1300, right: 56, top: "100%", minWidth: 280 }}><NotificationPanel /></Box>}
    <UserProfilePanel id={profileOpen ? "account-menu" : undefined} handleClick={() => setAnchorEl(null)} open={profileOpen} pop={anchorEl} />
  </Box>;
};
export default TopBar;
