import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { Sparkles } from "lucide-react";
import { getColorTokens } from "../theme/theme";

const GridWrapper = ({ columns, rows, isDatafetched }) => {
  const apiRef = useGridApiRef();
  const theme = useTheme();
  const colors = getColorTokens(theme.palette.mode);

  const handleResizeColumns = () => {
    if (apiRef.current?.autosizeColumns) {
      apiRef.current.autosizeColumns({
        includeHeaders: true,
        includeOutliers: true,
      });
    } else {
      console.warn(
        "autosizeColumns is not available in this DataGrid version."
      );
    }
  };
  const flexibleColumns = columns.map((col) => ({
    ...col,
    minWidth:
      col?.headerName == "S.No."
        ? 60
        : col?.headerName == "Actions"
        ? 300
        : 120,
    headerAlign: "center",
  }));

  return (
    <>
      <Box  height="60vh" width="100%" m="24px 0">
        <DataGrid
                 apiRef={apiRef}
          rows={rows}
          columns={flexibleColumns}
          loading={!isDatafetched}
          disableColumnSelector
          disableRowSelectionOnClick
          disableColumnResize
          sx={{
            width: "100%",
            height: "100%",
            border: "1px solid rgba(127,127,127,.22)",
            borderRadius: "16px",
            overflow: "hidden",
            background: theme.palette.mode === "dark" ? "rgba(24,22,32,.66)" : "rgba(255,255,255,.72)",
            backdropFilter: "blur(18px)",
            "& .MuiDataGrid-columnHeaders": { background: theme.palette.mode === "dark" ? "rgba(203,70,129,.12)" : "rgba(203,70,129,.08)", borderBottom: "1px solid rgba(127,127,127,.22)" },
            "& .MuiDataGrid-columnHeaderTitle": { fontWeight: 700 },
            "& .MuiDataGrid-cell": { borderBottomColor: "rgba(127,127,127,.12)" },
            "& .MuiDataGrid-row:hover": { backgroundColor: "rgba(203,70,129,.07)" },
            "& .MuiDataGrid-footerContainer": { borderTop: "1px solid rgba(127,127,127,.18)" },
          }}
        />
      </Box>

      <Box display="flex" justifyContent="flex-end" m="4px 0">
        <IconButton
          onClick={handleResizeColumns}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            borderRadius: 1,
            px: 2,
            color: colors.text[100],
            background: theme.palette.mode === "dark" ? "rgba(203,70,129,.12)" : "rgba(203,70,129,.08)",
            border: "1px solid rgba(127,127,127,.22)",
            borderRadius: "12px",
            color: colors.text[100],
          }}
        >
          <Sparkles size={18} strokeWidth={1.8} />
          <Typography
            variant="h5"
            sx={{
              lineHeight: 1,
              fontWeight: { xs: 200, sm: 400 },
              color: colors.text[100],
            }}
          >
            Resize
          </Typography>
        </IconButton>
      </Box>
    </>
  );
};

export default GridWrapper;
