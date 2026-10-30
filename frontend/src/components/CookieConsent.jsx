import { useEffect, useState } from "react";
import { enableAnalytics } from "../analytics.js";
import { Alert, Box, Button, Link, Typography } from "@mui/material";

const STORAGE_KEY = "campsync-cookie-consent";

export default function CookieConsent() {
  const [choice, setChoice] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  });
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const reopen = () => setChoice(null);
    window.addEventListener("campsync:open-cookie-settings", reopen);
    return () => window.removeEventListener("campsync:open-cookie-settings", reopen);
  }, []);

  const save = (value) => {
    try { localStorage.setItem(STORAGE_KEY, value); } catch {}
    setChoice(value);
    window.dispatchEvent(new CustomEvent("campsync:consent", { detail: value }));
  };

  useEffect(() => {
    if (choice === "accepted") {
      enableAnalytics();
      window.dispatchEvent(new CustomEvent("campsync:consent", { detail: choice }));
    }
  }, [choice]);

  if (choice) return null;

  const actionButtonSx = {
    minWidth: 0,
    minHeight: 44,
    width: "100%",
    px: 1.5,
    whiteSpace: "normal",
    lineHeight: 1.25,
    fontSize: { xs: "0.8rem", sm: "0.875rem" },
    fontWeight: 700,
  };

  return (
    <Box
      role="region"
      aria-label="Cookie preferences"
      sx={{
        position: "fixed",
        zIndex: 1500,
        bottom: { xs: 8, sm: 16 },
        left: { xs: 8, sm: 24 },
        right: { xs: 8, sm: 24 },
        width: "auto",
        maxWidth: 760,
        mx: "auto",
        p: { xs: 1.75, sm: 2.5 },
        border: 1,
        borderColor: "divider",
        borderRadius: 3,
        bgcolor: "background.paper",
        color: "text.primary",
        boxShadow: "0 12px 48px rgba(0,0,0,.24)",
      }}
    >
      <Typography fontWeight={750}>Your privacy choices</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        CampSync uses essential authentication cookies. Optional analytics are only enabled if configured and you allow them. Read our{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </Typography>

      {showSettings && (
        <Alert severity="info" sx={{ mt: 1.5 }}>
          Essential authentication storage is required for sign-in. Optional analytics remain off unless you choose “Allow cookies”.
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(3, minmax(0, 1fr))" },
          gap: 1,
          mt: 2,
          "& .MuiButton-root": actionButtonSx,
        }}
      >
        <Button variant="contained" onClick={() => save("accepted")}>
          Allow cookies
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => save("rejected")}
          sx={{
            borderColor: "text.secondary",
            color: "text.primary",
            "&:hover": { borderColor: "text.primary", bgcolor: "action.hover" },
          }}
        >
          Reject optional
        </Button>
        <Button
          color="inherit"
          onClick={() => setShowSettings((value) => !value)}
          sx={{ gridColumn: { xs: "1 / -1", sm: "auto" } }}
        >
          {showSettings ? "Hide details" : "Settings"}
        </Button>
      </Box>
    </Box>
  );
}
