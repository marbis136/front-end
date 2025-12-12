// src/views/pages/pedidos/IngredientesView.jsx
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
  Stack,
  Chip,
  Tooltip,
  InputAdornment,
  Divider,
} from "@mui/material";
import { CheckCircle, Cancel, Search, Inventory2Rounded } from "@mui/icons-material";
import { motion } from "framer-motion";
import api from "../../../../api/axios";
import { useAuth } from "../../../../auth/AuthContext";

export default function IngredientesView() {
  const { user } = useAuth();
  const [insumos, setInsumos] = useState([]);
  const [filtro, setFiltro] = useState("");

  const fetchInsumos = async () => {
    try {
      const res = await api.get("/insumo/");
      setInsumos(res.data || []);
    } catch (err) {
      console.error("Error al cargar insumos:", err);
    }
  };

  useEffect(() => {
    fetchInsumos();
  }, [user]);

  const handleToggleActivo = async (id, activo) => {
    try {
      await api.patch(`/insumo/${id}/`, { activo: !activo });
      fetchInsumos();
    } catch (err) {
      console.error("Error al actualizar insumo:", err);
    }
  };

  const insumosFiltrados = insumos.filter((i) =>
    i.nombre_insumo.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Box
      sx={{
        p: 4,
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8f9fa 0%, #eef3f7 100%)",
      }}
    >
      {/* 🔹 Encabezado */}
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <Inventory2Rounded
          sx={{ fontSize: 40, color: "success.main", filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.2))" }}
        />
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              color: "success.main",
              textShadow: "1px 1px 2px rgba(0,0,0,0.15)",
            }}
          >
            Ingredientes
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Sucursal: <b>{user?.almacen || "Sin asignar"}</b>
          </Typography>
        </Box>
      </Stack>

      {/* 🔍 Buscador */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          background: "linear-gradient(90deg, #ffffff 0%, #f5f9f6 100%)",
        }}
      >
        <TextField
          fullWidth
          size="medium"
          variant="outlined"
          label="Buscar ingrediente..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* 🧾 Tabla de ingredientes */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Paper
          elevation={5}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Table>
            <TableHead
              sx={{
                background: "linear-gradient(90deg, #4caf50, #66bb6a)",
              }}
            >
              <TableRow>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>#</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Nombre del insumo
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Estado</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>
                  Acción
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {insumosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary" fontStyle="italic">
                      No se encontraron ingredientes
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                insumosFiltrados.map((i, idx) => (
                  <motion.tr
                    key={i.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                  >
                    <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>
                      {idx + 1}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{i.nombre_insumo}</TableCell>
                    <TableCell>
                      <Chip
                        label={i.activo ? "Activo" : "Inactivo"}
                        color={i.activo ? "success" : "default"}
                        size="small"
                        sx={{
                          fontWeight: "bold",
                          letterSpacing: 0.5,
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title={i.activo ? "Deshabilitar" : "Habilitar"}>
                        <IconButton
                          color={i.activo ? "error" : "success"}
                          onClick={() => handleToggleActivo(i.id, i.activo)}
                          sx={{
                            "&:hover": {
                              transform: "scale(1.2)",
                              transition: "0.2s",
                            },
                          }}
                        >
                          {i.activo ? <Cancel /> : <CheckCircle />}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      </motion.div>

      {/* ✨ Pie de página */}
      <Divider sx={{ my: 4 }} />
      <Typography variant="caption" color="text.secondary" align="center" display="block">
        Sistema de gestión de insumos © {new Date().getFullYear()} — Desarrollado con ❤️ y React
        y por tu papi SANTIAGO...
      </Typography>
    </Box>
  );
}
