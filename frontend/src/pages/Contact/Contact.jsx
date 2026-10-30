import { useState } from "react";
import { Alert, Box, Button, Container, Paper, TextField, Typography, CircularProgress } from "@mui/material";
import { Mail, LifeBuoy } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Contact({ support = false }) {
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: "", email: "", subject: "", message: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const title = support ? "CampSync Support" : "Contact CampSync";
  const submit = async (event) => {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      await axios.post("/api/contact", { ...values, category: support ? "support" : "general" });
      setDone(true);
      navigate("/thank-you", { state: { message: "Your message has been sent. Thank you for contacting CampSync." } });
    } catch (e) {
      setError(e?.response?.data?.message || "We couldn't send your message. Please try again later.");
    } finally { setLoading(false); }
  };
  return <Container maxWidth="md" sx={{ py: { xs: 3, sm: 6 } }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1, color: "primary.main" }}>{support ? <LifeBuoy/> : <Mail/>}<Typography variant="overline">WE'RE HERE TO HELP</Typography></Box>
    <Typography component="h1" variant="h3" fontWeight={750}>{title}</Typography>
    <Typography color="text.secondary" sx={{ mt: 1, mb: 3, maxWidth: 620 }}>{support ? "Tell us what isn't working or what you need help with. Include enough detail to help us understand the issue, but do not include passwords or sensitive student information." : "Send the CampSync team a question or message. Please avoid including passwords or sensitive student information."}</Typography>
    <Paper component="form" onSubmit={submit} elevation={0} sx={{ p: { xs: 2, sm: 3 }, border: 1, borderColor: "divider", borderRadius: 3, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
      {error && <Alert severity="error" sx={{ gridColumn: "1 / -1" }}>{error}</Alert>}
      <TextField label="Your name" required value={values.name} onChange={e=>setValues({...values,name:e.target.value})} inputProps={{ maxLength: 120 }}/>
      <TextField label="Email address" type="email" required value={values.email} onChange={e=>setValues({...values,email:e.target.value})}/>
      <TextField label="Subject" required value={values.subject} onChange={e=>setValues({...values,subject:e.target.value})} sx={{ gridColumn: "1 / -1" }} inputProps={{ maxLength: 160 }}/>
      <TextField label="Message" required multiline minRows={5} value={values.message} onChange={e=>setValues({...values,message:e.target.value})} sx={{ gridColumn: "1 / -1" }} inputProps={{ maxLength: 5000 }}/>
      <Button type="submit" variant="contained" disabled={loading} sx={{ gridColumn: "1 / -1", justifySelf: "start", minWidth: 170 }}>{loading ? <><CircularProgress size={18} sx={{ mr: 1 }}/>Sending…</> : "Send message"}</Button>
    </Paper>
    {done && <Alert severity="success" sx={{ mt: 2 }}>Message sent.</Alert>}
  </Container>;
}
