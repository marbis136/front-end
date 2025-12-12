// src/views/pages/recepcion_pedidos/dashboardPedidos/PedidosView.jsx
import { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Divider,
  Stack,
  Box,
} from "@mui/material";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import { useAuth } from "../../../../auth/AuthContext";
import api from "../../../../api/axios";

export default function PedidosView({ setListos }) {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await api.get("/venta/pedidos/");
        // 👉 Invertimos el orden para que sea 1, 2, 3, 4, 5
        setPedidos((res.data || []).reverse());
      } catch (err) {
        console.error("Error al cargar pedidos:", err);
      }
    };
    fetchPedidos();
    const interval = setInterval(fetchPedidos, 10000);
    return () => clearInterval(interval);
  }, [user]);


  const getEstiloTarjeta = (tipo, estado) => {
    let fondo = "#f5f5f5";
    let borde = "#1976d2";
    let textoMarca = "";

    const tipoLower = tipo?.toLowerCase() || "";
    const estadoLower = estado?.toLowerCase() || "";

    if (estadoLower !== "vigente") {
      fondo = "#e0e0e0";
      borde = "#727272ff";
      textoMarca = estadoLower === "anulada" ? "ANULADA" : "CANCELADA";
    } else if (tipoLower.includes("mesa")) {
      fondo = "#ffb6b6ff";
      borde = "#f7afafff";
    } else if (tipoLower.includes("llevar") || tipoLower.includes("delivery")) {
      fondo = "#b6d1ecff";
      borde = "#a5cdf5ff";
    }

    return { fondo, borde, textoMarca };
  };

  // ✅ Al hacer clic: cambia en backend a LISTO
  const handleCardClick = async (pedido) => {
    try {
      await api.patch(`/venta/${pedido.id}/marcar-listo/`);
      setListos((prev) => [...prev, { ...pedido, estado: "LISTO" }]);
      setPedidos((prev) => prev.filter((p) => p.id !== pedido.id));
    } catch (err) {
      console.error("Error al marcar como listo:", err);
      alert("Error al marcar como listo en el servidor");
    }
  };

  return (
    <Box sx={{ width: "100vw", height: "100vh", overflowY: "auto", bgcolor: "#fafafa" }}>
      <Grid container spacing={0.8} justifyContent="flex-start" alignItems="flex-start">
        {pedidos.length === 0 ? (
          <Grid item xs={12}>
            <Typography textAlign="center" color="black" mt={4}>
              No hay pedidos pendientes
            </Typography>
          </Grid>
        ) : (
          pedidos.map((pedido) => {
            const { fondo, borde, textoMarca } = getEstiloTarjeta(
              pedido.tipo_operacion,
              pedido.estado
            );

            return (
              <Grid item key={pedido.id}>
                <Paper
                  onClick={() => handleCardClick(pedido)}
                  elevation={4}
                  sx={{
                    position: "relative",
                    borderRadius: 1.5,
                    bgcolor: fondo,
                    border: `2px solid ${borde}`,
                    width: 240,
                    minHeight: 200,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      transform: "translateY(-3px) scale(1.02)",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  {textoMarca && (
                    <Typography
                      variant="h2"
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%) rotate(-35deg)",
                        color: "rgba(255, 0, 0, 0.45)",
                        fontWeight: "bold",
                        letterSpacing: 4,
                        textTransform: "uppercase",
                        pointerEvents: "none",
                        fontSize: "3rem",
                      }}
                    >
                      {textoMarca}
                    </Typography>
                  )}

                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 0.8 }}>
                    <Typography fontWeight="bold" color="black" sx={{ fontSize: "1.25rem" }}>
                      PEDIDO #{pedido.codigo_pedido}
                    </Typography>
                     
                    <Stack direction="row" alignItems="center" spacing={0.3}>
                      <Typography variant="body2" fontWeight="bold" color="black">
                        {pedido.tiempo?.toString().padStart(2, "0") || "00"}m
                      </Typography>
                    </Stack>
                  </Stack>

                  <Typography variant="body2" fontWeight="bold" sx={{ px: 0.8, color: "black" }}>
                    {pedido.tipo_operacion}
                  </Typography>

                  <Divider sx={{ borderColor: "#00000050" }} />

                  <Box sx={{ flexGrow: 1, overflowY: "auto", px: 0.8, pb: 0.5 }}>
                    {pedido.detalles.map((d, idx) => (
                      <Stack
                        key={idx}
                        direction="row"
                        spacing={0.5}
                        sx={{
                          mb: 0.2,
                          fontSize: "1rem", // ✅ corregido
                          alignItems: "center",
                        }}
                      >
                        <Typography fontWeight="bold" color="black" sx={{ fontSize: "1rem" }}>
                          {d.cantidad}#
                        </Typography>
                        <Typography fontWeight="bold" color="black" sx={{ fontSize: "1.1rem" }}>
                          {d.producto}
                        </Typography>
                      </Stack>
                    ))}
                  </Box>


                  {pedido.observacion && (
                    <>
                      <Divider sx={{ borderColor: "#00000050" }} />
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="black"
                        sx={{
                          textAlign: "center",
                          fontSize: "0.9rem",
                          bgcolor: "#ffffff8a",

                        }}
                      >
                        {pedido.observacion}
                      </Typography>
                    </>
                  )}
                </Paper>
              </Grid>
            );
          })
        )}
      </Grid>
    </Box>
  );
}
