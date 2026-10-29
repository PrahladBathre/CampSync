import { Box, Typography, Button, useTheme } from "@mui/material";
import { getColorTokens } from "../theme/theme.js";
import PageHeading from "./PageHeading.jsx";
import GlassEffect from "./GlassEffect.jsx";
const GridHeaderWithAction = ({
  pageTitle,
  buttonLabel,
  onButtonClick,
  buttonSx = {},
}) => {
  const colors = getColorTokens(useTheme().palette.mode);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "flex-end" },
        justifyContent: "space-between",
        gap: 2,
        mb: 2,
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}><PageHeading>{pageTitle}</PageHeading></Box>
      <Box
        sx={{ display: "flex", justifyContent: { xs: "stretch", sm: "flex-end" }, width: { xs: "100%", sm: "auto" } }}
      >
        {onButtonClick && (
          <Button
            onClick={onButtonClick}
            sx={{
              color: "primary.contrastText",
              background: "primary.main",
              "&:hover": { background: "primary.dark", boxShadow: "0 8px 20px rgba(0,0,0,.12)" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 2.5,
              minHeight: 44,
              px: 2,
              py: 0.5,
              textTransform: "none",
              fontWeight: 650,
              boxShadow: "none",
              ...buttonSx,
              m: 0,
            }}
          >
            <GlassEffect
              sx={{ width: "100%", height: "100%", borderRadius: 2.5, m: 0, px: 0, py: 0, background: "transparent" }}
            >
              {/* <AddIcon color="inherit" /> */}
              <Typography
                variant="body1"
                sx={{ color: "inherit", fontWeight: 650, letterSpacing: 0, whiteSpace: "nowrap" }}
              >
                {buttonLabel}
              </Typography>
            </GlassEffect>
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default GridHeaderWithAction;
