/* eslint-disable no-unused-vars */
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import PageSectionWrapper from "../../components/PageSectionWrapper";
import GridHeaderWithAction from "../../components/GridHeaderWithAction";
import GridWrapper from "../../components/GridWrapper";
import { useCallback, useEffect, useMemo, useState } from "react";
// import { getColorTokens } from "../../theme/theme";
import { getAllTeachers } from "../../services/teacher";

const Teachers = () => {
  //⭐ row of teachers in [], setting using fetch
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  //⭐ fetch teacher
  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await getAllTeachers();
      setTeachers(response.map((teach, i) => ({
        ...teach,
        id: teach._id || i,
        index: i + 1,
        teacherAssignedSubjects: Array.isArray(teach.teacherAssignedSubjects)
          ? teach.teacherAssignedSubjects.map((subject) => subject?.subjectName || subject).join(", ")
          : teach.teacherAssignedSubjects || "",
      })));
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || error?.message || "Faculty records could not be loaded. Please sign in again and retry.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);
  //⭐ validation

  const columns = useMemo(
    () => [
      {
        field: "index",
        headerName: "S.No.",
        width: 80,
        maxWidth: 80,
      },
      {
        field: "teacherFullName",
        headerName: "Name",
      },
      {
        field: "teacherGender",
        headerName: "gender",
      },
      {
        field: "teacherEmail",
        headerName: "Email",
        headerAlign: "center",
      },
      {
        field: "teacherUsername",
        headerName: "Username",
      },
      {
        field: "teacherAssignedSubjects",
        headerName: "Subjects",
      },
      {
        field: "teacherContactInfo",
        headerName: "Contact",
      },
    ],
    []
  );
  return (
    <Box width="100%">
      <PageSectionWrapper>
        <GridHeaderWithAction pageTitle={"Faculty Directory"} />
        <Typography color="text.secondary" sx={{ mb: 2 }}>View faculty profiles, contact details, and assigned subjects in one place.</Typography>
        {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
        {loading && teachers.length === 0 && <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}><CircularProgress size={18} /><Typography variant="body2" color="text.secondary">Loading faculty records…</Typography></Box>}
        <GridWrapper columns={columns} rows={teachers} loading={loading} isDatafetched={!loading && !errorMessage} />
      </PageSectionWrapper>
    </Box>
  );
};

export default Teachers;
