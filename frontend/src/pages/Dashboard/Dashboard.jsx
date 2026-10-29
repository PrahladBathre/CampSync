import React, { useContext, useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { UsersRound, GraduationCap, BookOpen, Library, Sparkles } from "lucide-react";
import PageSectionWrapper from "../../components/PageSectionWrapper";
import RecentActivity from "./RecentActivity";
import axios from "axios";
import { UserContext } from "../UserContext/UserContext";
import "./dashboard-refresh.css";

const stats = [
  { key: "teachers", label: "Faculty members", icon: UsersRound, tone: "teal" },
  { key: "students", label: "Enrolled students", icon: GraduationCap, tone: "purple" },
  { key: "courses", label: "Active courses", icon: BookOpen, tone: "blue" },
  { key: "subjects", label: "Academic subjects", icon: Library, tone: "amber" },
];

export default function Dashboard() {
  const { user } = useContext(UserContext);
  const [counts, setCounts] = useState({ teachers: 0, students: 0, courses: 0, subjects: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let alive = true;
    axios.get("/api/v1/count-doc", { withCredentials: true })
      .then(({ data }) => {
        const payload = data?.data || {};
        if (alive) setCounts({ teachers: Number(payload.teachers) || 0, students: Number(payload.students) || 0, courses: Number(payload.courses) || 0, subjects: Number(payload.subjects) || 0 });
      })
      .catch(() => { if (alive) setError("We couldn’t load the latest totals. Your other pages may still be available."); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);
  const name = user?.displayName || user?.teacherFullName || user?.name || "there";
  return <PageSectionWrapper><Box className="camp-dashboard">
    <Box className="camp-hero"><Box className="camp-hero-copy">
      <span className="camp-eyebrow">YOUR ACADEMIC WORKSPACE</span>
      <Typography component="h1" className="camp-hero-title">Good to see you, {name.split(" ")[0]}.</Typography>
      <Typography className="camp-hero-subtitle">A clearer view of your department, classes, and campus activity.</Typography>
      <Box className="camp-hero-chip"><span className="camp-live-dot" /> Overview at a glance</Box>
    </Box><Box className="camp-hero-art" aria-hidden="true"><Box className="camp-orbit camp-orbit-one"/><Box className="camp-orbit camp-orbit-two"/><Box className="camp-art-card"><GraduationCap size={32} strokeWidth={1.7}/><span>Learn</span><strong>Grow</strong></Box><Box className="camp-art-spark"><Sparkles size={22} strokeWidth={1.7}/></Box></Box></Box>
    {error && <Alert severity="warning" sx={{mt:2}}>{error}</Alert>}
    <Box className="camp-section-heading"><Box><Typography component="h2">Campus overview</Typography><Typography>Key numbers across your academic workspace</Typography></Box>{loading && <CircularProgress size={20} aria-label="Loading campus totals"/>}</Box>
    <Box className="camp-stat-grid">{stats.map(({key,label,icon:Icon,tone})=><Box className="camp-stat-card" key={key}><Box className={`camp-stat-icon ${tone}`}><Icon/></Box><Box className="camp-stat-meta"><Typography>{label}</Typography><Typography component="strong">{loading?"—":counts[key].toLocaleString()}</Typography><span>Academic records</span></Box></Box>)}</Box>
    <Box className="camp-activity-heading"><Box><Typography component="h2">Recent activity</Typography><Typography>Stay in the loop with the latest campus updates.</Typography></Box></Box>
    <Box className="camp-activity-panel"><RecentActivity/></Box>
  </Box></PageSectionWrapper>;
}
