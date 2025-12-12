// src/components/LoadingOverlay.jsx
import { Box, CircularProgress, Typography } from "@mui/material";

export default function LoadingOverlay({ message = "Cargando..." }) {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        zIndex: 1300 // sobre cualquier modal
      }}
    >
      <CircularProgress color="info" size={60} />
      <Typography sx={{ mt: 2, color: "#fff", fontWeight: 600 }}>
        {message}
      </Typography>
    </Box>
  );
}
