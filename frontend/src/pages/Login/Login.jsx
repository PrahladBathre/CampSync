import { useContext, useState } from "react";
import { Alert, Box, Button, CircularProgress, IconButton, InputAdornment, TextField, Typography, useTheme } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { GraduationCap, Mail, UserRound, LockKeyhole, ArrowRight } from "lucide-react";
import { loginTeacher } from "../../services/teacher";
import LogoSync from "../../components/LogoSync";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext/UserContext";
import "./login-refresh.css";

export default function Login() {
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);
  const loginTheme = useTheme();
  const isDark = loginTheme.palette.mode === "dark";
  const [user, setUser] = useState({ teacherUsername: "", teacherEmail: "", teacherPassword: "" });
  const [isEmailLogin, setEmailLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlerLogin = async (event) => {
    event.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    const identifier = (isEmailLogin ? user.teacherEmail : user.teacherUsername).trim();
    const credentials = isEmailLogin
      ? { teacherEmail: identifier, teacherPassword: user.teacherPassword }
      : { teacherUsername: identifier, teacherPassword: user.teacherPassword };
    try {
      const logged = await loginTeacher(credentials);
      if (logged?.status === 200) {
        const { accessToken, ...teacherProfile } = logged.data.data || {};
        if (accessToken) {
          try { sessionStorage.setItem("campSyncAccessToken", accessToken); } catch {}
        }
        updateUser(teacherProfile);
        navigate("/");
      }
    } catch (e) {
      setError(e.response?.data?.message || "We couldn’t sign you in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return <Box className="camp-login-shell">
    <Box className="camp-login-story">
      <Box className="camp-login-brand"><LogoSync /></Box>
      <Box className="camp-login-story-copy">
        <span className="camp-login-kicker">CAMPUS, CONNECTED.</span>
        <Typography component="h1">A smarter way to manage your academic world.</Typography>
        <Typography className="camp-login-story-subtitle">Bring campus operations, learning, and everyday coordination into one clear workspace.</Typography>
        <Box className="camp-login-feature"><span>01</span><Box><strong>One campus workspace</strong><Typography>Academic information in one organized place.</Typography></Box></Box>
        <Box className="camp-login-feature"><span>02</span><Box><strong>Built for your day</strong><Typography>Quick access to the tools your team uses.</Typography></Box></Box>
      </Box>
      <Box className="camp-login-story-footer">CampSync <span>•</span> Your academic workspace</Box>
      <Box className="camp-login-decoration camp-login-decoration-one"/><Box className="camp-login-decoration camp-login-decoration-two"/>
    </Box>
    <Box className="camp-login-main">
      <Box className="camp-login-mobile-brand"><LogoSync /></Box>
      <Box component="form" className="camp-login-card" onSubmit={handlerLogin} style={{ "--login-action": isDark ? "#ffe4ee" : "#651039", "--login-action-hover": isDark ? "#ffffff" : "#3f0823", "--login-action-bg": isDark ? "rgba(255,228,238,.12)" : "rgba(101,16,57,.08)", "--login-submit": isDark ? "#ad245f" : "#8b1248" }}>
        <Box className="camp-login-icon"><GraduationCap size={25} strokeWidth={1.8} /></Box>
        <Typography component="h2" className="camp-login-title">Welcome back</Typography>
        <Typography className="camp-login-subtitle">Sign in to continue to your workspace.</Typography>
        <Box className="camp-login-demo" aria-label="Recruiter demo account">
          <Box><Typography className="camp-login-demo-title">Recruiter demo account</Typography><Typography className="camp-login-demo-copy">Explore CampSync using the demo teacher account.</Typography></Box>
          <Box className="camp-login-demo-credentials"><Typography component="span">Username: <strong>demoteach</strong></Typography><Typography component="span">Password: <strong>CampSyncDemo2026!</strong></Typography></Box>
          <Button type="button" variant="outlined" onClick={() => { setEmailLogin(false); setUser({ teacherUsername: "demoteach", teacherEmail: "", teacherPassword: "CampSyncDemo2026!" }); setError(""); }}>Use demo credentials</Button>
        </Box>
        {error && <Alert severity="error" sx={{mt:2,mb:1}} role="alert">{error}</Alert>}
        <Box className="camp-login-fields">
          <TextField fullWidth label={isEmailLogin ? "Email address" : "Username"} name={isEmailLogin ? "teacherEmail" : "teacherUsername"} autoComplete={isEmailLogin ? "email" : "username"} required value={isEmailLogin ? user.teacherEmail : user.teacherUsername} onChange={(e)=>setUser({...user,[e.target.name]:e.target.value})} InputProps={{startAdornment:<InputAdornment position="start">{isEmailLogin?<Mail size={18}/>:<UserRound size={18}/>}</InputAdornment>}} inputProps={{"aria-label":isEmailLogin ? "Email address" : "Username"}} />
          <TextField fullWidth label="Password" name="teacherPassword" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={user.teacherPassword} onChange={(e)=>setUser({...user,teacherPassword:e.target.value})} inputProps={{"aria-label":"Password"}} InputProps={{startAdornment:<InputAdornment position="start"><LockKeyhole size={18}/></InputAdornment>,endAdornment:<InputAdornment position="end"><IconButton aria-label={showPassword ? "Hide password" : "Show password"} onClick={()=>setShowPassword(v=>!v)} edge="end">{showPassword ? <VisibilityOffOutlinedIcon/> : <VisibilityOutlinedIcon/>}</IconButton></InputAdornment>}} />
        </Box>
        <Button type="submit" endIcon={!loading && <ArrowRight size={18}/>} fullWidth variant="contained" disabled={loading} className="camp-login-submit" sx={{ display: "inline-flex !important", visibility: "visible !important", opacity: "1 !important", minHeight: 50, color: "#ffffff !important", backgroundColor: "#9d174d !important", fontWeight: 800, fontSize: 15, "&:hover": { backgroundColor: "#74103f !important" }, "&.Mui-disabled": { color: "#ffffff !important", backgroundColor: "#9d174d !important", opacity: .6 } }}>{loading ? <><CircularProgress size={18} color="inherit" sx={{mr:1}}/>Signing you in…</> : "Sign in"}</Button>
        <Button type="button" className="camp-login-switch" onClick={()=>{setEmailLogin(v=>!v);setError("");}} sx={{ color: "var(--login-action) !important", borderColor: "var(--login-action) !important", backgroundColor: "var(--login-action-bg) !important", fontWeight: 800, "&:hover": { color: "var(--login-action-hover) !important", borderColor: "var(--login-action-hover) !important", backgroundColor: "var(--login-action-bg) !important" } }}>{isEmailLogin ? "Use username instead" : "Sign in with email instead"}</Button>
        <Box className="camp-login-signup"><Typography sx={{ color: "text.secondary" }}>New to CampSync?</Typography><Button type="button" className="camp-login-create-account" variant="outlined" onClick={()=>navigate("/register")} sx={{ display: "inline-flex !important", visibility: "visible !important", opacity: "1 !important", flex: "0 0 auto", minWidth: "150px", minHeight: 44, color: "var(--login-action) !important", border: "2px solid var(--login-action) !important", backgroundColor: "var(--login-action-bg) !important", fontWeight: 700, "&:hover": { color: "var(--login-action-hover) !important", borderColor: "var(--login-action-hover) !important", backgroundColor: "var(--login-action-bg) !important" } }}>Create an account</Button></Box>
        <Typography className="camp-login-footnote">Secure access for your campus community</Typography>
      </Box>
    </Box>
  </Box>;
}
