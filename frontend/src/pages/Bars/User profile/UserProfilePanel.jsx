import { useContext, useState } from "react";
import { Box, Button, Popper, Typography, Alert } from "@mui/material";
import { LogOut, Settings2 } from "lucide-react";
import { UserContext } from "../../UserContext/UserContext";
import { logoutTeacher } from "../../../services/teacher";
import { useNavigate } from "react-router-dom";
import UpdateUser from "../../UpdateUser/UpdateUser";

const UserProfile = ({ id, open, pop, handleClick }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const logoutHandler = async () => {
    setLoggingOut(true); setError("");
    try { await logoutTeacher(); clearUser(); handleClick?.(); navigate("/login", { replace: true }); }
    catch (e) { setError(e?.response?.data?.message || "Could not sign out. Please try again."); }
    finally { setLoggingOut(false); }
  };
  return <>
    <Popper id={id} open={open} anchorEl={pop} placement="bottom-end" sx={{ zIndex: 1400 }}>
      <Box sx={{ mt: 1, p: 1.5, minWidth: 220, border: 1, borderColor: "divider", borderRadius: 3, bgcolor: "background.paper", backdropFilter: "blur(24px)", boxShadow: "0 18px 50px rgba(0,0,0,.18)", borderColor: "rgba(203,70,129,.22)" }}>
        <Typography fontWeight={700} sx={{ px: 1, pt: .5 }}>{user?.teacherFullName || user?.displayName || "Your account"}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ px: 1, mb: 1.5 }}>{user?.teacherEmail || user?.email || ""}</Typography>
        {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
        <Button fullWidth startIcon={<Settings2 size={18} />} onClick={() => { setSettingsOpen(true); handleClick?.(); }} sx={{ justifyContent: "flex-start" }}>Profile settings</Button>
        <Button fullWidth color="error" startIcon={<LogOut size={18} />} onClick={logoutHandler} disabled={loggingOut} sx={{ justifyContent: "flex-start" }}>{loggingOut ? "Signing out…" : "Sign out"}</Button>
      </Box>
    </Popper>
    <UpdateUser open={settingsOpen} onClose={() => setSettingsOpen(false)} />
  </>;
};
export default UserProfile;
