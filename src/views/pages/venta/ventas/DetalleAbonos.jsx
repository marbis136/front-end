import { useState, useEffect, useMemo } from "react";
import {
  Box, Grid, TextField, FormControlLabel, Checkbox, Select, MenuItem,
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Stack, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Card, CardActionArea, Divider, Tooltip, IconButton,
  useTheme, CircularProgress, Snackbar, Alert
} from "@mui/material";
import dayjs from "dayjs";
import StoreIcon from "@mui/icons-material/Store";
import PersonIcon from "@mui/icons-material/Person";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { pagoVentaApi } from "./apisVenta/pagoVentaApi";
import { useAuth } from "../../../../auth/AuthContext";

export default function DetalleAbonos() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { user } = useAuth();

  // -----------------------------
  // Estados de filtros
  // -----------------------------
  const [formaPago, setFormaPago] = useState("");
  const [porFechas, setPorFechas] = useState(true);
  const [fechaDel, setFechaDel] = useState(dayjs().startOf("day").format("YYYY-MM-DDTHH:mm"));
  const [fechaAl, setFechaAl] = useState(dayjs().endOf("day").format("YYYY-MM-DDTHH:mm"));
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal y notificaciones
  const [modalOpen, setModalOpen] = useState(false);
  const [abonoSeleccionado, setAbonoSeleccionado] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "info" });

  // =========================================================
  // 🔹 Cargar abonos (filtro por usuario, almacén, fechas, forma de pago)
  // =========================================================
  useEffect(() => {
    const fetchAbonos = async () => {
      setLoading(true);
      try {
        const params = {};

        if (user?.id) params.usuario__id = user.id;
        if (user?.almacen?.id) params["venta__almacen__id"] = user.almacen.id;
        if (formaPago) params.forma_pago = formaPago;

        if (porFechas) {
          params.fecha_inicio = dayjs(fechaDel).format("YYYY-MM-DDTHH:mm:ss");
          params.fecha_fin = dayjs(fechaAl).format("YYYY-MM-DDTHH:mm:ss");
        }

        const data = await pagoVentaApi.getPagos(params);
        console.log("💳 Datos de pagos:", data);
        setRows(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error al cargar abonos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAbonos();
  }, [user, formaPago, porFechas, fechaDel, fechaAl]);

  // =========================================================
  // 🔹 Totales
  // =========================================================
  const total = useMemo(() => rows.reduce((a, r) => a + Number(r.monto || 0), 0), [rows]);

  // =========================================================
  // 🔹 Modal cambio de método
  // =========================================================
  const abrirModal = (abono) => {
    setAbonoSeleccionado(abono);
    setModalOpen(true);
  };
  const cerrarModal = () => setModalOpen(false);

  const cambiarMetodo = async (nuevoMetodo) => {
    try {
      const response = await pagoVentaApi.cambiarMetodo(abonoSeleccionado.id, nuevoMetodo);
      const qr = response?.qr_generado;

      setRows((prev) =>
        prev.map((r) =>
          r.id === abonoSeleccionado.id ? { ...r, forma_pago: nuevoMetodo } : r
        )
      );

      setSnack({
        open: true,
        message: qr
          ? `Método cambiado a QR. Código generado: ${qr}`
          : `Método de pago cambiado a ${nuevoMetodo}`,
        severity: "success",
      });
    } catch (err) {
      console.error("Error al cambiar método de pago:", err);
      setSnack({
        open: true,
        message:
          err.response?.data?.detalle || "No se pudo cambiar el método de pago.",
        severity: "error",
      });
    } finally {
      cerrarModal();
    }
  };

  // =========================================================
  // 🔹 Render principal
  // =========================================================
  return (
    <Box>
      {/* =========================================================
           FILTROS
         ========================================================= */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          boxShadow: 3,
          background: isDark
            ? "linear-gradient(180deg, #1e1e1e 0%, #222 100%)"
            : "linear-gradient(180deg, #fafafa 0%, #fff 100%)",
        }}
      >
        <Typography variant="h6" fontWeight={700} mb={2} color="primary">
          💰 Detalle de Abonos
        </Typography>

        <Grid container spacing={3}>
          {/* Columna izquierda */}
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1} alignItems="center">
              <StoreIcon color="primary" />
              <Typography variant="body1">
                <b>Almacén:</b> {user?.almacen || "Sin almacén asignado"}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
              <PersonIcon color="primary" />
              <Typography variant="body1">
                <b>Usuario:</b> {user?.nombre || user?.username || ""}
              </Typography>
            </Stack>

            <Select
              value={formaPago}
              onChange={(e) => setFormaPago(e.target.value)}
              size="small"
              fullWidth
              displayEmpty
              sx={{ mt: 2 }}
            >
              <MenuItem value="">
                <em>Forma de Pago</em>
              </MenuItem>
              <MenuItem value="EFECTIVO">EFECTIVO</MenuItem>
              <MenuItem value="TARJETA">TARJETA</MenuItem>
              <MenuItem value="QR">QR</MenuItem>
              <MenuItem value="TRANSFERENCIA">TRANSFERENCIA</MenuItem>
            </Select>
          </Grid>

          {/* Columna derecha */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={porFechas}
                      onChange={(e) => setPorFechas(e.target.checked)}
                    />
                  }
                  label="Filtrar por fechas"
                />
                {porFechas && (
                  <Stack direction="row" spacing={1}>
                    <TextField
                      type="datetime-local"
                      size="small"
                      label="Desde"
                      value={fechaDel}
                      onChange={(e) => setFechaDel(e.target.value)}
                      fullWidth
                    />
                    <TextField
                      type="datetime-local"
                      size="small"
                      label="Hasta"
                      value={fechaAl}
                      onChange={(e) => setFechaAl(e.target.value)}
                      fullWidth
                    />
                  </Stack>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* =========================================================
           TABLA DE ABONOS
         ========================================================= */}
      <Paper
        sx={{
          borderRadius: 3,
          boxShadow: 3,
          overflow: "hidden",
          bgcolor: isDark ? "#1c1c1c" : "#fff",
        }}
      >
        {loading ? (
          <Stack p={5} alignItems="center" justifyContent="center">
            <CircularProgress color="primary" />
            <Typography mt={2}>Cargando abonos...</Typography>
          </Stack>
        ) : (
          <TableContainer sx={{ maxHeight: 480 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow sx={{ backgroundColor: isDark ? "#222" : "#f3f4f6" }}>
                  <TableCell><b>Código Venta</b></TableCell>
                  <TableCell><b>Código Pedido</b></TableCell>
                  <TableCell><b>N° Factura</b></TableCell>
                  <TableCell align="right"><b>Monto (Bs.)</b></TableCell>
                  <TableCell><b>Forma de Pago</b></TableCell>
                  <TableCell><b>Usuario</b></TableCell>
                  <TableCell><b>Estado</b></TableCell>
                  <TableCell align="center"><b>Acciones</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((r, i) => (
                  <TableRow
                    key={r.id}
                    hover
                    sx={{
                      backgroundColor:
                        i % 2 === 0
                          ? isDark
                            ? "#181818"
                            : "#fff"
                          : isDark
                          ? "#202020"
                          : "#fafafa",
                      "&:hover": {
                        backgroundColor: isDark ? "#2a2f3a" : "#f0f7ff",
                      },
                    }}
                  >
                    <TableCell>{r.codigo_venta}</TableCell>
                    <TableCell>{r.codigo_pedido}</TableCell>
                    <TableCell>{r.numero_factura || "-"}</TableCell>
                    <TableCell align="right">
                      {r.monto ? Number(r.monto).toFixed(2) : "0.00"}
                    </TableCell>
                    <TableCell>{r.forma_pago}</TableCell>
                    <TableCell>{r.usuario_nombre}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        color={
                          ["ANULADA", "CANCELADA"].includes(r.estado)
                            ? "error"
                            : "success"
                        }
                        label={r.estado}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Cambiar método de pago">
                        <span>
                          <IconButton
                            onClick={() => abrirModal(r)}
                            color="primary"
                            size="small"
                            disabled={
                              ["ANULADA", "CANCELADA"].includes(r.estado) ||
                              Number(r.monto) === 0
                            }
                          >
                            <SwapHorizIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* =========================================================
           PIE DE TOTALES
         ========================================================= */}
      <Paper
        sx={{
          mt: 2,
          p: 2,
          borderRadius: 3,
          background: isDark ? "#151515" : "#f9fafb",
          boxShadow: 1,
        }}
      >
        <Stack direction="row" justifyContent="flex-end" spacing={3}>
          <Stack alignItems="flex-end">
            <Typography variant="body2" color="text.secondary">
              TOTAL Bs.
            </Typography>
            <TextField
              size="small"
              value={total.toFixed(2)}
              InputProps={{ readOnly: true }}
            />
          </Stack>
        </Stack>
      </Paper>

      {/* =========================================================
           MODAL CAMBIAR MÉTODO DE PAGO
         ========================================================= */}
      <Dialog open={modalOpen} onClose={cerrarModal} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: "center", fontWeight: 700, pb: 1 }}>
          Cambiar Método — {abonoSeleccionado?.codigo_venta}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body2" mb={2}>
            Selecciona el nuevo método de pago:
          </Typography>
          <Grid container spacing={2}>
            {["EFECTIVO", "TARJETA", "QR", "TRANSFERENCIA"]
              .filter((m) => m !== abonoSeleccionado?.forma_pago)
              .map((metodo) => (
                <Grid item xs={12} key={metodo}>
                  <Card
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      "&:hover": {
                        boxShadow: 4,
                        bgcolor: isDark ? "#223344" : "#f0f9ff",
                      },
                    }}
                  >
                    <CardActionArea
                      sx={{ p: 2, textAlign: "center" }}
                      onClick={() => cambiarMetodo(metodo)}
                    >
                      <Typography
                        variant="h6"
                        color={isDark ? "primary.light" : "primary.main"}
                      >
                        {metodo === "QR" ? "GENERAR QR" : metodo}
                      </Typography>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button onClick={cerrarModal} variant="outlined">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* =========================================================
           SNACKBAR DE NOTIFICACIÓN
         ========================================================= */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4500}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnack({ ...snack, open: false })}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
