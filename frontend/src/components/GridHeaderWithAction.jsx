import { Box, Button } from "@mui/material";
import { Plus } from "lucide-react";
import PageHeading from "./PageHeading.jsx";

const GridHeaderWithAction = ({ pageTitle, buttonLabel, onButtonClick, buttonSx = {} }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      alignItems: { xs: "stretch", sm: "flex-end" },
      justifyContent: "space-between",
      gap: 2,
      mb: 2,
      minWidth: 0,
    }}
  >
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <PageHeading>{pageTitle}</PageHeading>
    </Box>
    {onButtonClick && (
      <Button
        onClick={onButtonClick}
        variant="contained"
        color="secondary"
        startIcon={<Plus size={18} />}
        sx={{
          width: { xs: "100%", sm: "auto" },
          minHeight: 44,
          borderRadius: 2.5,
          px: 2,
          py: 1,
          whiteSpace: "normal",
          ...buttonSx,
        }}
      >
        {buttonLabel}
      </Button>
    )}
  </Box>
);

export default GridHeaderWithAction;
