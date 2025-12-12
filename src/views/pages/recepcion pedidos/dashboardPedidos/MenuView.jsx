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
import {
  CheckCircle,
  Cancel,
  Search,
  LocalPizzaRounded,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import api from "../../../../api/axios";
import { useAuth } from "../../../../auth/AuthContext";

export default function MenuView() {
  const { user } = useAuth();
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("");

  // 🧠 Cargar solo productos de clasificación "PIZZAS"
  const fetchMenu = async () => {
    try {
      const res = await api.get("/menu-precio/");
      const pizzas = (res.data || []).filter(
        (p) => p.category?.toUpperCase() === "PIZZAS"
      );
      setProductos(pizzas);
    } catch (err) {
      console.error("Error al cargar menú:", err);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [user]);

  // ✅ Cambiar estado del producto y actualizar en tiempo real
  const handleToggleActivo = async (id, activo) => {
    try {
      await api.patch(`/menu-precio/${id}/`, { activo: !activo });
      const res = await api.get("/menu-precio/");
      const productosActualizados = res.data || [];
      const pizzas = productosActualizados.filter(
        (p) => p.category?.toUpperCase() === "PIZZAS"
      );
      setProductos(pizzas);

      // 🚀 Emitir evento global para PuntoDeVenta
      window.dispatchEvent(
        new CustomEvent("refrescarProductos", { detail: productosActualizados })
      );
    } catch (err) {
      console.error("Error al actualizar estado del menú:", err);
    }
  };

  const productosFiltrados = productos.filter(
    (p) =>
      p.name?.toLowerCase().includes(filtro.toLowerCase()) ||
      p.code?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Box sx={{ p: 4, minHeight: "100vh", background: "#fff8f6" }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <LocalPizzaRounded sx={{ fontSize: 40, color: "#d84315" }} />
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: "#d84315" }}>
            Menú de PIZZAS 🍕
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Sucursal: <b>{user?.almacen || "Sin asignar"}</b>
          </Typography>
        </Box>
      </Stack>

      <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <TextField
          fullWidth
          size="medium"
          variant="outlined"
          label="Buscar pizza por nombre o código..."
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

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <Paper elevation={4} sx={{ borderRadius: 4, overflow: "hidden" }}>
          <Table>
            <TableHead sx={{ background: "#ff7043" }}>
              <TableRow>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>#</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Código</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Nombre</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Estado</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Sin resultados
                  </TableCell>
                </TableRow>
              ) : (
                productosFiltrados.map((p, i) => (
                  <TableRow key={p.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{p.code}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={p.activo ? "Activo" : "Inactivo"}
                        color={p.activo ? "success" : "default"}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        title={p.activo ? "Deshabilitar" : "Habilitar"}
                      >
                        <IconButton
                          color={p.activo ? "error" : "success"}
                          onClick={() => handleToggleActivo(p.id, p.activo)}
                        >
                          {p.activo ? <Cancel /> : <CheckCircle />}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      </motion.div>

      <Divider sx={{ my: 4 }} />
      <Typography
        variant="caption"
        align="center"
        display="block"
        color="text.secondary"
      >
        © {new Date().getFullYear()} Sistema de menú — actualización en tiempo real
      </Typography>
    </Box>
  );
}
