import { Box, Container, Link as MuiLink, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function SiteFooter() {
  return <Box component="footer" sx={{ mt: 5, py: 2.5, borderTop: 1, borderColor: "divider" }}>
    <Container maxWidth="lg" sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 1.5 }}>
      <Typography variant="caption" color="text.secondary">© {new Date().getFullYear()} CampSync · Campus management made simpler</Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        <MuiLink component={Link} to="/privacy" underline="hover" variant="caption">Privacy</MuiLink>
        <MuiLink component={Link} to="/terms" underline="hover" variant="caption">Terms</MuiLink>
        <MuiLink component={Link} to="/contact" underline="hover" variant="caption">Contact</MuiLink>
        <MuiLink component={Link} to="/support" underline="hover" variant="caption">Support</MuiLink>
      </Box>
    </Container>
  </Box>;
}
