import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  useTheme,
} from "@mui/material";
import GlassEffect from "../../components/GlassEffect";
import { getColorTokens } from "../../theme/theme";

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const colors = getColorTokens(useTheme().palette.mode);

  useEffect(() => {
    let active = true;
    axios
      .get("/api/v1/recentactivity", { withCredentials: true })
      .then((res) => {
        if (active) setActivities(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error("Unable to load recent activity:", err));
    return () => {
      active = false;
    };
  }, []);

  return (
    <GlassEffect sx={{ width: "100%" }}>
      <Typography variant="h6" gutterBottom color={colors.text[100]}>
        Recent Activity
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: colors.text[100] }}>Date</TableCell>
            <TableCell sx={{ color: colors.text[100] }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {activities.map((act) => (
            <TableRow key={act._id || `${act.date}-${act.message}`}>
              <TableCell sx={{ color: colors.text[100] }}>
                {act.date ? new Date(act.date).toLocaleDateString() : "—"}
              </TableCell>
              <TableCell sx={{ color: colors.text[100] }}>{act.message}</TableCell>
            </TableRow>
          ))}
          {activities.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} sx={{ color: colors.text[100] }}>
                No recent activity yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </GlassEffect>
  );
};

export default RecentActivity;
