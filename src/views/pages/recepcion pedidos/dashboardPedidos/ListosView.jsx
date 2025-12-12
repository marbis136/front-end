// src/views/pages/recepcion_pedidos/dashboardPedidos/ListosView.jsx
import { useEffect, useState, useRef } from "react";
import {
  Grid,
  Paper,
  Typography,
  Divider,
  Stack,
  Box,
  Switch,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import { motion } from "framer-motion";
import { useAuth } from "../../../../auth/AuthContext";
import api from "../../../../api/axios";

export default function ListosView() {
  const { user } = useAuth();
  const [listos, setListos] = useState([]);
  const [mostrarFinalizados, setMostrarFinalizados] = useState(true);
  const scrollRef = useRef(null);

  // 🗣️ Función para reproducir voz
  // 🗣️ Función mejorada: voz masculina y natural
const hablar = (texto) => {
  if ("speechSynthesis" in window) {
    // Detiene cualquier voz en curso (evita solapamiento)
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = "es-ES";
    utterance.rate = 0.9;     // Ligeramente más lento para claridad
    utterance.pitch = 1;     // Tono más grave (voz de hombre)
    utterance.volume = 1.0;    // Volumen máximo

   
    // 🚀 Ligerísimo retraso para asegurar que las voces se carguen
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 150);
  } else {
    console.warn("⚠️ Tu navegador no soporta SpeechSynthesis.");
  }
};


  // ✅ Cargar pedidos listos
  useEffect(() => {
    const fetchListos = async () => {
      try {
        const res = await api.get("/venta/listos/");
        const data = (res.data || []).reverse();

        setListos((prev) => {
          const merged = data.map((nuevo) => {
            const anterior = prev.find((p) => p.id === nuevo.id);
            if (anterior) {
              return {
                ...nuevo,
                entregados: anterior.entregados,
                finalizado: anterior.finalizado,
              };
            }
            return {
              ...nuevo,
              entregados: nuevo.detalles.map(() => false),
              finalizado: false,
            };
          });
          return merged;
        });
      } catch (err) {
        console.error("Error al cargar pedidos listos:", err);
      }
    };
    fetchListos();
    const interval = setInterval(fetchListos, 10000);
    return () => clearInterval(interval);
  }, [user]);

  // 🎨 Estilo según tipo
  const getEstiloTarjeta = (tipo) => {
    let fondo = "#c8e6c9";
    let borde = "#81c784";
    if (tipo?.toLowerCase().includes("mesa")) {
      fondo = "#ffb6b6ff";
      borde = "#f7afafff";
    } else if (
      tipo?.toLowerCase().includes("llevar") ||
      tipo?.toLowerCase().includes("delivery")
    ) {
      fondo = "#b6d1ecff";
      borde = "#a5cdf5ff";
    }
    return { fondo, borde };
  };

  // ✅ Marcar producto como entregado
  const toggleProductoEntregado = (pedidoIdx, productoIdx) => {
    setListos((prev) => {
      const updated = [...prev];
      const pedido = { ...updated[pedidoIdx] };
      pedido.entregados = [...pedido.entregados];
      pedido.entregados[productoIdx] = !pedido.entregados[productoIdx];
      updated[pedidoIdx] = pedido;

      const todosEntregados = pedido.entregados.every((e) => e);
      if (todosEntregados && !pedido.finalizado) {
        marcarFinalizado(pedido);
      }
      return updated;
    });
  };

  // ✅ Cambia estado en backend
  const marcarFinalizado = async (pedido) => {
    try {
      await api.patch(`/venta/${pedido.id}/marcar-finalizado/`);
      setListos((prev) =>
        prev.map((p) =>
          p.id === pedido.id ? { ...p, finalizado: true } : p
        )
      );
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error("Error al marcar pedido como finalizado:", err);
    }
  };

  // 🪄 Ordenar: finalizados arriba si están visibles
  const pedidosOrdenados = listos.sort((a, b) =>
    a.finalizado === b.finalizado ? 0 : a.finalizado ? -1 : 1
  );

  return (
    <Box
      ref={scrollRef}
      sx={{
        width: "100vw",
        height: "100vh",
        overflowY: "auto",
        bgcolor: "#fafafa",
        p: 2,
      }}
    >
     
      <Grid container spacing={0.8} justifyContent="flex-start" alignItems="flex-start">
        {listos.length === 0 ? (
          <Grid item xs={12}>
            <Typography textAlign="center" color="black" mt={4}>
              No hay pedidos listos
            </Typography>
          </Grid>
        ) : (
          pedidosOrdenados.map((pedido, pedidoIdx) => {
            const { fondo, borde } = getEstiloTarjeta(pedido.tipo_operacion);
            const ocultar = pedido.finalizado && !mostrarFinalizados;

            return (
              <Grid item key={pedido.id}>
                {!ocultar && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: pedido.finalizado ? -50 : 30 }}
                    animate={{ opacity: 1, y: pedido.finalizado ? -10 : 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Paper
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
                        transition: "all 0.25s ease",
                        cursor: "default",
                        "&:hover": {
                          transform: "translateY(-3px) scale(1.01)",
                          boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                        },
                      }}
                    >
                      {/* --- CABECERA --- */}
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ p: 0.8 }}
                      >
                        <Typography
                          fontWeight="bold"
                          color="black"
                          sx={{ fontSize: "1.25rem" }}
                        >
                          PEDIDO #{pedido.codigo_pedido}
                        </Typography>

                        <Stack direction="row" alignItems="center" spacing={0.3}>
                          <Typography variant="body2" fontWeight="bold" color="black">
                            {pedido.tiempo?.toString().padStart(2, "0") || "00"}m
                          </Typography>
                        </Stack>

                        {/* 🔊 Icono de voz */}
                        <IconButton
                          size="small"
                          onClick={() =>
                            hablar(
                              `Pedido ${pedido.codigo_pedido} }`
                            )
                          }
                        >
                          <VolumeUpRoundedIcon sx={{ color: "black" }} />
                        </IconButton>
                      </Stack>

                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{ px: 0.8, color: "black" }}
                      >
                        {pedido.tipo_operacion}
                      </Typography>

                      <Divider sx={{ borderColor: "#00000050" }} />

                      {/* --- DETALLES --- */}
                      <Box sx={{ flexGrow: 1, overflowY: "auto", px: 0.8, pb: 0.5 }}>
                        {pedido.detalles.map((d, idx) => {
                          const tachado = pedido.entregados[idx];
                          return (
                            <Stack
                              key={idx}
                              direction="row"
                              spacing={0.5}
                              sx={{
                                mb: 0.25,
                                cursor: "pointer",
                                textDecoration: tachado ? "line-through" : "none",
                                opacity: tachado ? 0.5 : 1,
                                "&:hover": { opacity: 0.8 },
                              }}
                              onClick={() => toggleProductoEntregado(pedidoIdx, idx)}
                            >
                              <Typography fontWeight="bold" color="black">
                                {d.cantidad}#
                              </Typography>
                              <Typography fontWeight="bold" color="black">
                                {d.producto}
                              </Typography>
                            </Stack>
                          );
                        })}
                      </Box>

                      {/* --- OBSERVACIONES --- */}
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
                              borderRadius: 1,
                              p: 0.8,
                              mx: 0.6,
                              mb: 0.5,
                            }}
                          >
                            {pedido.observacion}
                          </Typography>
                        </>
                      )}
                    </Paper>
                  </motion.div>
                )}
              </Grid>
            );
          })
        )}
      </Grid>
    </Box>
  );
}
