import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Paper, Typography, useTheme } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";
import axios from "axios";
import PageHeading from "../../components/PageHeading.jsx";

export default function LineChart() {
  const theme = useTheme();
  const [days, setDays] = useState([]);
  const [datedRecords, setDatedRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    axios.get("/api/attendance/insights", { withCredentials: true })
      .then(({ data: response }) => {
        const insight = response?.data?.data || response?.data || {};
        if (!active) return;
        setDays(Array.isArray(insight.dailyTrend) ? insight.dailyTrend : []);
        setDatedRecords(Number(insight.datedRecords) || 0);
      })
      .catch((e) => { if (active) setError(e.response?.data?.message || "Attendance trends could not be loaded."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const series = [
    { id: "Present", color: "#2f9e72", key: "present" },
    { id: "Absent", color: "#d95767", key: "absent" },
    { id: "Late", color: "#e3a23b", key: "late" },
    { id: "Excused", color: "#6e82d9", key: "excused" },
  ].map((item) => ({ id: item.id, data: days.map((day) => ({ x: day.date, y: Number(day[item.key]) || 0 })) }))
   .filter((line) => line.data.some((point) => point.y > 0));

  const chartTheme = {
    textColor: theme.palette.text.primary,
    axis: { domain: { line: { stroke: theme.palette.divider } }, ticks: { text: { fill: theme.palette.text.secondary } } },
    grid: { line: { stroke: theme.palette.divider } },
    legends: { text: { fill: theme.palette.text.secondary } },
    tooltip: { container: { background: theme.palette.background.paper, color: theme.palette.text.primary } },
  };

  return <Box sx={{ width: "100%", minWidth: 0, p: { xs: 0, sm: 1 } }}>
    <PageHeading subtitle="Track recorded attendance by date to spot changes in presence and absence. Dates without a saved attendance date are excluded.">Attendance trends</PageHeading>
    {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
    {loading ? <CircularProgress aria-label="Loading attendance trends" /> : days.length === 0
      ? <Alert severity="info">There are no dated attendance records to show yet. Add attendance dates to create a trend.</Alert>
      : <Paper variant="outlined" sx={{ p: { xs: 1, sm: 2 }, borderRadius: 3, backgroundColor: "background.paper", borderColor: "divider" }}>
          <Typography variant="body2" color="text.secondary">{datedRecords.toLocaleString()} dated records across {days.length} days</Typography>
          <Box sx={{ height: { xs: 340, sm: 440 }, width: "100%", mt: 1 }}>
            <ResponsiveLine data={series} margin={{ top: 18, right: 18, bottom: 86, left: 48 }} xScale={{ type: "point" }} yScale={{ type: "linear", min: 0, max: "auto", stacked: false, reverse: false }} curve="monotoneX" axisBottom={{ tickSize: 0, tickPadding: 10, tickRotation: -35 }} axisLeft={{ tickSize: 0, tickPadding: 8, legend: "Records", legendOffset: -38, legendPosition: "middle" }} pointSize={7} pointColor={{ from: "serieColor" }} pointBorderWidth={2} pointBorderColor={{ from: "serieColor" }} useMesh colors={series.map((item) => item.color)} legends={[{ anchor: "top-left", direction: "row", justify: false, translateY: -8, itemWidth: 74, itemHeight: 18, itemsSpacing: 6, symbolSize: 10, symbolShape: "circle" }]} theme={chartTheme} role="img" ariaLabel="Daily attendance counts by attendance status" />
          </Box>
        </Paper>}
  </Box>;
}
