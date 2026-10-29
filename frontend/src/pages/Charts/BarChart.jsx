import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Paper, Typography, useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import axios from "axios";
import PageHeading from "../../components/PageHeading.jsx";

export default function BarChart() {
  const theme = useTheme();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    axios.get("/api/v1/count-doc", { withCredentials: true })
      .then(({ data }) => {
        const counts = data?.data || {};
        if (active) setRows([
          { category: "Students", total: Number(counts.students) || 0 },
          { category: "Faculty", total: Number(counts.teachers) || 0 },
          { category: "Courses", total: Number(counts.courses) || 0 },
          { category: "Subjects", total: Number(counts.subjects) || 0 },
        ]);
      })
      .catch((e) => { if (active) setError(e.response?.data?.message || "Campus totals could not be loaded."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const chartTheme = {
    textColor: theme.palette.text.primary,
    axis: { domain: { line: { stroke: theme.palette.divider } }, ticks: { text: { fill: theme.palette.text.secondary } } },
    grid: { line: { stroke: theme.palette.divider } },
    tooltip: { container: { background: theme.palette.background.paper, color: theme.palette.text.primary } },
  };

  return <Box sx={{ width: "100%", minWidth: 0, p: { xs: 0, sm: 1 } }}>
    <PageHeading subtitle="Compare the number of student, faculty, course, and subject records currently stored.">Campus record totals</PageHeading>
    {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
    {loading ? <CircularProgress aria-label="Loading campus totals" /> : <Paper variant="outlined" sx={{ p: { xs: 1, sm: 2 }, borderRadius: 3, backgroundColor: "background.paper", borderColor: "divider" }}>
      <Typography variant="body2" color="text.secondary">Current totals · refreshed when this page loads</Typography>
      <Box sx={{ height: { xs: 330, sm: 420 }, width: "100%", mt: 1 }}>
        <ResponsiveBar data={rows} keys={["total"]} indexBy="category" margin={{ top: 18, right: 18, bottom: 48, left: 52 }} padding={0.42} valueScale={{ type: "linear" }} indexScale={{ type: "band", round: true }} colors={["#cb4681"]} borderRadius={4} axisBottom={{ tickSize: 0, tickPadding: 10 }} axisLeft={{ tickSize: 0, tickPadding: 8, legend: "Records", legendOffset: -40, legendPosition: "middle" }} enableLabel labelSkipWidth={16} labelSkipHeight={16} enableGridY theme={chartTheme} role="img" ariaLabel="Bar chart comparing current campus record totals" />
      </Box>
    </Paper>}
  </Box>;
}
