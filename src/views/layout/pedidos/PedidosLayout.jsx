// src/views/layout/pedidos/PedidosLayout.jsx
import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function PedidosLayout() {
  return (
    <Box
      sx={{
        bgcolor: "#fafafa",
        minHeight: "100vh",
        p: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Container maxWidth="xl" sx={{ p: 0, flexGrow: 1 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
