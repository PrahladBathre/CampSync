import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Paper, Typography, useTheme } from "@mui/material";
import { ResponsivePie } from "@nivo/pie";
import axios from "axios";
import PageHeading from "../../components/PageHeading.jsx";

export default function PieChart() {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    axios.get("/api/attendance/insights", { withCredentials: true })
      .then(({ data: response }) => {
        const insight = response?.data?.data || response?.data || {};
        if (!active) return;
        setTotal(Number(insight.totalRecords) || 0);
        setData((insight.statusCounts || []).map((item) => ({
          id: item.status, label: item.status, value: Number(item.count) || 0,
        })).filter((item) => item.value > 0));
      })
      .catch((e) => { if (active) setError(e.response?.data?.message || "Attendance insights could not be loaded."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const chartTheme = {
    textColor: theme.palette.text.primary,
    labels: { text: { fill: theme.palette.text.primary } },
    legends: { text: { fill: theme.palette.text.secondary } },
  };

  return <Box sx={{ width: "100%", minWidth: 0, p: { xs: 0, sm: 1 } }}>
    <PageHeading subtitle="Understand how recorded attendance is split across present, absent, late, and excused statuses.">Attendance status</PageHeading>
    {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
    {loading ? <CircularProgress aria-label="Loading attendance status" /> : data.length === 0
      ? <Alert severity="info">No attendance records are available yet. Record attendance to populate this chart.</Alert>
      : <Paper variant="outlined" sx={{ p: { xs: 1, sm: 2 }, borderRadius: 3, backgroundColor: "background.paper", borderColor: "divider" }}>
          <Typography variant="body2" color="text.secondary">{total.toLocaleString()} total attendance records</Typography>
          <Box sx={{ height: { xs: 330, sm: 420 }, width: "100%", mt: 1 }}>
            <ResponsivePie data={data} margin={{ top: 20, right: 18, bottom: 64, left: 18 }} innerRadius={0.58} padAngle={1.5} cornerRadius={4} activeOuterRadiusOffset={6} arcLinkLabelsSkipAngle={12} arcLinkLabelsTextColor={theme.palette.text.primary} arcLinkLabelsThickness={2} arcLinkLabelsColor={{ from: "color" }} arcLabelsSkipAngle={10} colors={["#2f9e72", "#d95767", "#e3a23b", "#6e82d9"]} legends={[{ anchor: "bottom", direction: "row", justify: false, translateY: 58, itemWidth: 90, itemHeight: 18, itemsSpacing: 6, symbolSize: 10, symbolShape: "circle" }]} theme={chartTheme} role="img" ariaLabel="Attendance records grouped by status" />
          </Box>
        </Paper>}
  </Box>;
}
