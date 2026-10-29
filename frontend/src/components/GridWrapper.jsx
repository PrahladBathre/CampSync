import { useMemo, useState } from "react";
import { Box, IconButton, InputAdornment, TextField, Typography, useTheme } from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { Search, Sparkles, X } from "lucide-react";

const GridWrapper = ({ columns = [], rows = [], isDatafetched, loading }) => {
  const apiRef = useGridApiRef();
  const theme = useTheme();
  const headerBg = theme.palette.mode === "dark" ? "#292532" : "#f6eaf1";
  const headerText = theme.palette.mode === "dark" ? "#ffffff" : "#302536";
  const [search, setSearch] = useState("");

  const flexibleColumns = useMemo(() => columns.map((col) => ({
    ...col,
    minWidth: col?.headerName === "S.No." || col?.headerName === "S. no." ? 64 : col?.headerName === "Actions" ? 180 : (col.minWidth || 120),
    headerAlign: col.headerAlign || "left",
    flex: col.flex ?? (col.width ? undefined : 1),
  })), [columns]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    if (!term) return rows;
    const searchableFields = columns.filter((column) => column.field && column.filterable !== false && column.type !== "actions");
    return rows.filter((row) => searchableFields.some((column) => {
      const value = row?.[column.field];
      const text = Array.isArray(value)
        ? value.map((item) => typeof item === "object" ? Object.values(item || {}).join(" ") : item).join(" ")
        : value && typeof value === "object"
          ? Object.values(value).join(" ")
          : value;
      return String(text ?? "").toLocaleLowerCase().includes(term);
    }));
  }, [columns, rows, search]);

  const handleResizeColumns = () => {
    if (apiRef.current?.autosizeColumns) {
      apiRef.current.autosizeColumns({ includeHeaders: true, includeOutliers: true });
    }
  };

  return (
    <Box sx={{ width: "100%", minWidth: 0, my: 2.5 }}>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5, alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between", mb: 1.5 }}>
        <TextField
          size="small"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={columns.length ? "Search all table columns…" : "No searchable columns"}
          aria-label="Search table rows"
          disabled={!columns.length || !rows.length}
          sx={{ width: { xs: "100%", sm: "min(100%, 360px)" }, "& .MuiOutlinedInput-root": { backgroundColor: "background.paper", borderRadius: 2 } }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search size={17} /></InputAdornment>,
            endAdornment: search ? <InputAdornment position="end"><IconButton size="small" aria-label="Clear table search" onClick={() => setSearch("")}><X size={16} /></IconButton></InputAdornment> : null,
          }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}>
          {search.trim() ? `${filteredRows.length} of ${rows.length} records` : `${rows.length} records`}
        </Typography>
      </Box>
      <Box sx={{ height: { xs: "min(64vh, 540px)", sm: "min(68vh, 620px)" }, minHeight: 300, width: "100%", minWidth: 0 }}>
        <DataGrid
          apiRef={apiRef}
          rows={filteredRows}
          columns={flexibleColumns}
          loading={loading ?? !isDatafetched}
          disableColumnSelector
          disableRowSelectionOnClick
          disableColumnResize
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
          localeText={{ noRowsLabel: search.trim() ? "No records match your search" : "No records to display" }}
          sx={{
            width: "100%",
            height: "100%",
            border: 1,
            borderColor: "divider",
            borderRadius: 3,
            overflow: "hidden",
            backgroundColor: "background.paper",
            color: "text.primary",
            "& .MuiDataGrid-columnHeaders": { backgroundColor: `${headerBg} !important`, color: `${headerText} !important`, borderBottom: 1, borderColor: "divider" },
            "& .MuiDataGrid-columnHeader, & .MuiDataGrid-columnHeaderTitle, & .MuiDataGrid-columnHeaderTitleContainer, & .MuiDataGrid-columnHeader .MuiIconButton-root": { color: `${headerText} !important`, opacity: "1 !important" },
            "& .MuiDataGrid-columnHeader .MuiSvgIcon-root": { color: `${headerText} !important` },
            "& .MuiDataGrid-columnHeaderTitle": { fontWeight: 700, whiteSpace: "normal", lineHeight: 1.25 },
            "& .MuiDataGrid-columnHeader": { py: 1 },
            "& .MuiDataGrid-cell": { borderBottomColor: "divider", minWidth: 0, whiteSpace: "normal", lineHeight: 1.35, py: 1 },
            "& .MuiDataGrid-row:hover": { backgroundColor: "action.hover" },
            "& .MuiDataGrid-footerContainer": { borderTop: 1, borderColor: "divider", minHeight: 52 },
            "& .MuiDataGrid-actionsCell": { gap: .5 },
            "& .MuiDataGrid-actionsCell .MuiIconButton-root": { borderRadius: 2, minWidth: 36, minHeight: 36 },
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": { outline: "none" },
            "& .MuiDataGrid-virtualScroller": { overflowX: "auto" },
            "& .MuiDataGrid-overlay": { backgroundColor: "background.paper" },
          }}
        />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
        <IconButton onClick={handleResizeColumns} aria-label="Resize columns to fit content" title="Resize columns to fit content" sx={{ display: "flex", alignItems: "center", gap: 1, borderRadius: 2, px: 2, color: "text.primary", backgroundColor: "action.hover", border: 1, borderColor: "divider" }}>
          <Sparkles size={17} strokeWidth={1.8} />
          <Typography component="span" sx={{ lineHeight: 1, fontWeight: 600, fontSize: "0.875rem", color: "inherit" }}>Fit columns</Typography>
        </IconButton>
      </Box>
    </Box>
  );
};

export default GridWrapper;
