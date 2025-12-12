import { useEffect, useMemo, useState } from "react";
import {
  Box, Grid, TextField, FormControlLabel, Checkbox,
  Stack, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, Card, CardActionArea, Divider,
  Tooltip, IconButton, Button, CircularProgress, useTheme
} from "@mui/material";
import dayjs from "dayjs";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { ventasApi } from "./apisVenta/ventasApi";
import { useAuth } from "../../../../auth/AuthContext";

export default function DetalleVentas() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { user } = useAuth();

  // -----------------------------
  // Filtros
  // -----------------------------
  const [porFechas, setPorFechas] = useState(true);
  const [fechaDel, setFechaDel] = useState(dayjs().startOf("day").format("YYYY-MM-DDTHH:mm"));
  const [fechaAl, setFechaAl] = useState(dayjs().endOf("day").format("YYYY-MM-DDTHH:mm"));
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // Modal de opciones y anulación
  // -----------------------------
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAnular, setModalAnular] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [motivo, setMotivo] = useState("");

  // =========================================================
  // 🔹 Cargar ventas del usuario logueado
  // =========================================================
  useEffect(() => {
    const fetchVentas = async () => {
      setLoading(true);
      try {
        const params = {};

        if (porFechas) {
          params.fecha_inicio = dayjs(fechaDel).format("YYYY-MM-DDTHH:mm");
          params.fecha_fin = dayjs(fechaAl).format("YYYY-MM-DDTHH:mm");
        }

        if (user?.id) params.usuario__id = user.id;
        if (user?.almacen?.id) params.almacen__id = user.almacen.id;

        const data = await ventasApi.getVentas(params);
        setRows(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error al cargar ventas:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVentas();
  }, [porFechas, fechaDel, fechaAl, user]);

  // =========================================================
  // 🔹 Totales (solo ventas vigentes)
  // =========================================================
  const ventasVigentes = useMemo(
    () => rows.filter((r) => r.estado !== "ANULADA"),
    [rows]
  );

  const totalBs = useMemo(
    () => ventasVigentes.reduce((a, r) => a + Number(r.total_venta || 0), 0),
    [ventasVigentes]
  );
  const totalNeto = useMemo(
    () => ventasVigentes.reduce((a, r) => a + Number(r.total_neto || 0), 0),
    [ventasVigentes]
  );
  const totalDescuento = useMemo(
    () => ventasVigentes.reduce((a, r) => a + Number(r.descuento_total || 0), 0),
    [ventasVigentes]
  );

  // =========================================================
  // 🔹 Modal interactivo
  // =========================================================
  const abrirModal = (venta) => {
    setVentaSeleccionada(venta);
    setModalOpen(true);
  };
  const cerrarModal = () => setModalOpen(false);

  // Abre el modal para escribir el motivo
  const abrirModalAnular = () => {
    setMotivo("");
    setModalAnular(true);
    setModalOpen(false);
  };
  const cerrarModalAnular = () => setModalAnular(false);

  // =========================================================
  // 🔹 Acción anular venta con motivo
  // =========================================================
  const anularVenta = async () => {
    if (!motivo.trim()) {
      alert("Debe ingresar un motivo de anulación.");
      return;
    }

    try {
      await ventasApi.anularVenta(ventaSeleccionada.id, { motivo_anulacion: motivo });
      setRows((prev) =>
        prev.map((r) =>
          r.id === ventaSeleccionada.id
            ? {
                ...r,
                estado: "ANULADA",
                tipo_venta: "ANULADA",
                forma_pago: "ANULADA",
                total_neto: 0,
                motivo_descuento: motivo,
              }
            : r
        )
      );
    } catch (error) {
      console.error("Error al anular venta:", error);
      alert("Error al anular la venta.");
    } finally {
      cerrarModalAnular();
    }
  };

  // =========================================================
  // 🔹 Render principal
  // =========================================================
  return (
    <Box>
      {/* =========================================================
           PANEL DE FILTROS
         ========================================================= */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          boxShadow: 3,
          background: isDark
            ? "linear-gradient(180deg, #1e1e1e 0%, #222 100%)"
            : "linear-gradient(180deg, #fafafa 0%, #fff 100%)",
        }}
      >
        <Typography variant="h6" fontWeight={700} mb={2} color="primary">
          🔍 Filtros de Búsqueda
        </Typography>

        <Grid container spacing={1.5} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControlLabel
              control={<Checkbox checked={porFechas} onChange={(e) => setPorFechas(e.target.checked)} />}
              label="Por fechas"
            />
          </Grid>

          {porFechas && (
            <>
              <Grid item xs={6} md={3}>
                <TextField
                  type="datetime-local"
                  size="small"
                  label="Del"
                  value={fechaDel}
                  onChange={(e) => setFechaDel(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  type="datetime-local"
                  size="small"
                  label="Al"
                  value={fechaAl}
                  onChange={(e) => setFechaAl(e.target.value)}
                  fullWidth
                />
              </Grid>
            </>
          )}

          <Grid item xs={12} md={3}>
            <Typography variant="body1">
                <b>Usuario:</b> {user?.nombre || user?.username || ""}
            </Typography>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="body1">
                <b>Almacén:</b> {user?.almacen || "Sin almacén asignado"}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* =========================================================
           TABLA DE RESULTADOS
         ========================================================= */}
      <Paper sx={{ borderRadius: 3, boxShadow: 3, overflow: "hidden" }}>
        {loading ? (
          <Stack p={5} alignItems="center" justifyContent="center">
            <CircularProgress color="primary" />
            <Typography mt={2}>Cargando ventas...</Typography>
          </Stack>
        ) : (
          <TableContainer sx={{ maxHeight: 480 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow sx={{ backgroundColor: isDark ? "#222" : "#f3f4f6" }}>
                  <TableCell><b>Código Venta</b></TableCell>
                  <TableCell><b>Código Pedido</b></TableCell>
                  <TableCell><b>N° Factura</b></TableCell>
                  <TableCell><b>Forma Pago</b></TableCell>
                  <TableCell align="right"><b>Total</b></TableCell>
                  <TableCell align="right"><b>Descuento</b></TableCell>
                  <TableCell align="right"><b>Total Neto</b></TableCell>
                  <TableCell><b>Motivo Descuento</b></TableCell>
                  <TableCell><b>Usuario</b></TableCell>
                  <TableCell><b>Tipo Venta</b></TableCell>
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
                      backgroundColor: i % 2 === 0
                        ? (isDark ? "#181818" : "#fff")
                        : (isDark ? "#202020" : "#fafafa"),
                      "&:hover": { backgroundColor: isDark ? "#2a2f3a" : "#f0f7ff" },
                    }}
                  >
                    <TableCell>{r.codigo_venta}</TableCell>
                    <TableCell>{r.codigo_pedido}</TableCell>
                    <TableCell>{r.numero_factura || "-"}</TableCell>
                    <TableCell>{r.forma_pago}</TableCell>
                    <TableCell align="right">{Number(r.total_venta).toFixed(2)}</TableCell>
                    <TableCell align="right">{Number(r.descuento_total).toFixed(2)}</TableCell>
                    <TableCell align="right">{Number(r.total_neto).toFixed(2)}</TableCell>
                    <TableCell>{r.motivo_descuento || "-"}</TableCell>
                    <TableCell>{r.usuario_nombre || "-"}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={r.tipo_venta}
                        color={r.tipo_venta === "ANULADA" ? "error" : "success"}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={r.estado}
                        color={r.estado === "ANULADA" ? "error" : "success"}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver opciones">
                        <IconButton onClick={() => abrirModal(r)} color="primary" size="small">
                          <MoreHorizIcon />
                        </IconButton>
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
      <Paper sx={{ mt: 2, p: 2, borderRadius: 3, background: isDark ? "#151515" : "#f9fafb", boxShadow: 1 }}>
        <Stack direction="row" justifyContent="flex-end" spacing={3}>
          <Stack alignItems="flex-end">
            <Typography variant="body2" color="text.secondary">TOTAL Bs.</Typography>
            <TextField size="small" value={totalBs.toFixed(2)} InputProps={{ readOnly: true }} />
          </Stack>
          <Stack alignItems="flex-end">
            <Typography variant="body2" color="text.secondary">DESCUENTO Bs.</Typography>
            <TextField size="small" value={totalDescuento.toFixed(2)} InputProps={{ readOnly: true }} />
          </Stack>
          <Stack alignItems="flex-end">
            <Typography variant="body2" color="text.secondary">TOTAL NETO Bs.</Typography>
            <TextField size="small" value={totalNeto.toFixed(2)} InputProps={{ readOnly: true }} />
          </Stack>
        </Stack>
      </Paper>

      {/* =========================================================
           MODAL DE OPCIONES
         ========================================================= */}
      <Dialog open={modalOpen} onClose={cerrarModal} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: "center", fontWeight: 700 }}>
          Acciones — {ventaSeleccionada?.codigo_venta}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ borderRadius: 2, "&:hover": { boxShadow: 4 } }}>
                <CardActionArea sx={{ p: 2, textAlign: "center" }} onClick={abrirModalAnular}>
                  <Typography variant="h6" color="error"> Anular Venta</Typography>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button onClick={cerrarModal} variant="outlined">Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* =========================================================
           MODAL DE ANULACIÓN (con motivo)
         ========================================================= */}
      <Dialog open={modalAnular} onClose={cerrarModalAnular} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: "center", fontWeight: 700 }}>
          Motivo de Anulación
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 3 }}>
          <Typography mb={1}>
            Ingrese el motivo por el cual desea anular la venta <b>{ventaSeleccionada?.codigo_venta}</b>:
          </Typography>
          <TextField
            multiline
            minRows={3}
            fullWidth
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ej: Error en el monto, cliente canceló..."
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button onClick={cerrarModalAnular} variant="outlined">Cancelar</Button>
          <Button onClick={anularVenta} color="error" variant="contained">Confirmar Anulación</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
