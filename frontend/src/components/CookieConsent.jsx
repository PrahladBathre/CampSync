import { useEffect, useState } from "react";
import { enableAnalytics } from "../analytics.js";
import { Alert, Box, Button, Link, Typography } from "@mui/material";

const STORAGE_KEY = "campsync-cookie-consent";
export default function CookieConsent() {
  const [choice, setChoice] = useState(() => { try { return localStorage.getItem(STORAGE_KEY); } catch { return null; } });
  const [showSettings, setShowSettings] = useState(false);
  useEffect(() => { const reopen = () => setChoice(null); window.addEventListener("campsync:open-cookie-settings", reopen); return () => window.removeEventListener("campsync:open-cookie-settings", reopen); }, []);
  const save = (value) => {
    try { localStorage.setItem(STORAGE_KEY, value); } catch {}
    setChoice(value);
    window.dispatchEvent(new CustomEvent("campsync:consent", { detail: value }));
  };
  useEffect(() => {
    if (choice === "accepted") { enableAnalytics(); window.dispatchEvent(new CustomEvent("campsync:consent", { detail: choice })); }
  }, [choice]);
  if (choice) return null;
  return <Box role="region" aria-label="Cookie preferences" sx={{ position: "fixed", zIndex: 1500, bottom: 16, left: { xs: 12, sm: 24 }, right: { xs: 12, sm: 24 }, maxWidth: 760, mx: "auto", p: 2.5, border: 1, borderColor: "divider", borderRadius: 3, bgcolor: "background.paper", boxShadow: "0 12px 48px rgba(0,0,0,.2)" }}>
    <Typography fontWeight={750}>Your privacy choices</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>CampSync uses essential authentication cookies. Optional analytics are only enabled if configured and you allow them. Read our <Link href="/privacy">Privacy Policy</Link>.</Typography>
    {showSettings && <Alert severity="info" sx={{ mt: 1.5 }}>Essential authentication storage is required for sign-in. Optional analytics remain off unless you choose “Allow analytics”.</Alert>}
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
      <Button variant="contained" onClick={() => save("accepted")}>Allow analytics</Button>
      <Button variant="outlined" onClick={() => save("rejected")}>Reject optional</Button>
      <Button color="inherit" onClick={() => setShowSettings(v=>!v)}>{showSettings ? "Hide details" : "Settings"}</Button>
    </Box>
  </Box>;
}
