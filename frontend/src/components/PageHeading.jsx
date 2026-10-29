import { Box, Typography } from "@mui/material";

function PageHeading({ children, subtitle }) {
  return (
    <Box sx={{ textAlign: "left", mx: { xs: 1, sm: 2 }, mt: { xs: 1, sm: 2 }, mb: 2 }}>
      <Typography
        component="h1"
        variant="h4"
        sx={{ fontWeight: 750, letterSpacing: "-.035em", lineHeight: 1.2, overflowWrap: "anywhere" }}
      >
        {children}
      </Typography>
      {subtitle && (
        <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 760, lineHeight: 1.65 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

export default PageHeading;