import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { Sparkles } from "lucide-react";
import { getColorTokens } from "../theme/theme";

const GridWrapper = ({ columns, rows, isDatafetched, loading }) => {
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
      <Box sx={{ height: { xs: "min(68vh, 560px)", md: "60vh" }, minHeight: 320, width: "100%", minWidth: 0, my: 3 }}>
        <DataGrid
                 apiRef={apiRef}
          rows={rows}
          columns={flexibleColumns}
          loading={loading ?? !isDatafetched}
          disableColumnSelector
          disableRowSelectionOnClick
          disableColumnResize
          sx={{
            width: "100%",
            height: "100%",
            border: 1,
            borderColor: "divider",
            borderRadius: 3,
            overflow: "hidden",
            backgroundColor: "background.paper",
            color: "text.primary",
            "& .MuiDataGrid-columnHeaders": { backgroundColor: "action.hover", borderBottom: 1, borderColor: "divider" },
            "& .MuiDataGrid-columnHeaderTitle": { fontWeight: 700 },
            "& .MuiDataGrid-cell": { borderBottomColor: "divider", minWidth: 0 },
            "& .MuiDataGrid-row:hover": { backgroundColor: "action.hover" },
            "& .MuiDataGrid-footerContainer": { borderTop: 1, borderColor: "divider" },
            "& .MuiDataGrid-actionsCell": { gap: .5 },
            "& .MuiDataGrid-actionsCell .MuiIconButton-root": { borderRadius: 2, minWidth: 36, minHeight: 36 },
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": { outline: "none" },
            "& .MuiDataGrid-virtualScroller": { overflowX: "auto" },
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
            borderRadius: 2,
            px: 2,
            color: "text.primary",
            backgroundColor: "action.hover",
            border: 1,
            borderColor: "divider",
          }}
        >
          <Sparkles size={18} strokeWidth={1.8} />
          <Typography
            variant="h5"
            sx={{
              lineHeight: 1,
              fontWeight: 600,
              color: "inherit",
              fontSize: "0.875rem",
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
