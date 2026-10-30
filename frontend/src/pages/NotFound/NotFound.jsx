import { Box, Button, Container, Paper, Stack, Typography, useTheme } from "@mui/material";
import { ArrowLeft, ArrowRight, Compass, Home, SearchX } from "lucide-react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

export default function NotFound() {
  const theme = useTheme();
  const navigate = useNavigate();
  const accent = theme.palette.primary.main;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
        py: 5,
        overflow: "hidden",
        position: "relative",
        background: theme.palette.mode === "dark"
          ? "radial-gradient(ellipse at 50% 0%, rgba(203,70,129,.16), transparent 55%), #17151b"
          : "radial-gradient(ellipse at 50% 0%, rgba(203,70,129,.13), transparent 58%), #faf8fa",
      }}
    >
      <Box aria-hidden="true" sx={{ position: "absolute", width: 340, height: 340, borderRadius: "50%", border: "1px solid", borderColor: "divider", top: -220, right: { xs: -190, sm: "8%" }, opacity: .55 }} />
      <Box aria-hidden="true" sx={{ position: "absolute", width: 260, height: 260, borderRadius: "50%", border: "1px solid", borderColor: "divider", bottom: -180, left: { xs: -150, sm: "10%" }, opacity: .55 }} />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            textAlign: "center",
            p: { xs: 3, sm: 6 },
            borderRadius: { xs: 4, sm: 5 },
            border: 1,
            borderColor: "divider",
            backgroundColor: theme.palette.mode === "dark" ? "rgba(35,32,40,.88)" : "rgba(255,255,255,.88)",
            backdropFilter: "blur(16px)",
          }}
        >
          <Box sx={{ width: 76, height: 76, mx: "auto", mb: 2.5, display: "grid", placeItems: "center", borderRadius: 3, color: accent, backgroundColor: theme.palette.mode === "dark" ? "rgba(203,70,129,.16)" : "rgba(203,70,129,.10)" }}>
            <SearchX size={38} strokeWidth={1.7} />
          </Box>

          <Typography component="p" sx={{ fontSize: { xs: "4.5rem", sm: "6rem" }, lineHeight: 1, fontWeight: 800, letterSpacing: "-.07em", color: accent }}>
            404
          </Typography>
          <Typography component="h1" variant="h4" sx={{ mt: 2, fontWeight: 750, letterSpacing: "-.035em" }}>
            Page not found
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5, mx: "auto", maxWidth: 390, lineHeight: 1.75 }}>
            Looks like this page has moved, is no longer available, or the address was entered incorrectly.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="center" sx={{ mt: 4 }}>
            <Button
              variant="contained"
              component={RouterLink}
              to="/"
              startIcon={<Home size={17} />}
              endIcon={<ArrowRight size={16} />}
              sx={{ minHeight: 46, px: 2.5, borderRadius: 2.5, fontWeight: 700 }}
            >
              Back to dashboard
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              startIcon={<ArrowLeft size={17} />}
              sx={{ minHeight: 46, px: 2.5, borderRadius: 2.5, fontWeight: 650, borderColor: "divider", color: "text.primary" }}
            >
              Go back
            </Button>
          </Stack>

          <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mt: 4, color: "text.secondary" }}>
            <Compass size={15} />
            <Typography variant="caption">CampSync · Campus management made simpler</Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
