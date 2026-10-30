import { Box, Button, Paper, Typography } from "@mui/material";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function ThankYou() {
  const location = useLocation();
  const message = location.state?.message || "Your request has been received.";
  return <Box sx={{ minHeight: "75vh", display: "grid", placeItems: "center", p: 2 }}>
    <Paper elevation={0} sx={{ maxWidth: 560, width: "100%", p: { xs: 3, sm: 5 }, textAlign: "center", border: 1, borderColor: "divider", borderRadius: 4 }}>
      <Box sx={{ width: 68, height: 68, mx: "auto", mb: 2, display: "grid", placeItems: "center", borderRadius: "50%", bgcolor: "success.light", color: "success.dark" }}><CheckCircle2 size={34}/></Box>
      <Typography component="h1" variant="h4" fontWeight={750}>Thank you!</Typography>
      <Typography color="text.secondary" sx={{ mt: 1.5, mb: 3 }}>{message}</Typography>
      <Button component={Link} to="/" variant="contained" endIcon={<ArrowRight size={17}/>}>Return to CampSync</Button>
    </Paper>
  </Box>;
}
