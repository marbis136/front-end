import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fade,
  Chip,
  Stack,
  Card,
  CardContent,
  Grid,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import api from "../../../../api/axios";
import { useAuth } from "../../../../auth/AuthContext";

export default function Caja() {
  const { user } = useAuth();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [cajaAbierta, setCajaAbierta] = useState(false);
  const [estado, setEstado] = useState("CERRADO");
  const [cierreId, setCierreId] = useState(null);
  const [montoApertura, setMontoApertura] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const estadoInicialResumen = {
    anulados: 0,
    gastos: 0,
    ventas: 0,
    cortesia: 0,
    efectivo: 0,
    tarjeta: 0,
    qr: 0,
    transferencia: 0,
    cantidad_anulados: 0,
    descuentos: 0,
  };
  const [resumen, setResumen] = useState(estadoInicialResumen);

  const usuarioId = user?.id ?? null;

  let almacenId = null;
  if (typeof user?.almacen === "object" && user.almacen?.id) {
    almacenId = user.almacen.id;
  } else if (Number.isInteger(user?.almacen)) {
    almacenId = user.almacen;
  } else if (typeof user?.almacen === "string") {
    almacenId = null;
  }

  const almacenNombre =
    typeof user?.almacen === "object"
      ? user.almacen.nombre_almacen
      : user?.almacen || "Desconocido";

  // --- Verificar caja activa ---
  useEffect(() => {
    const verificarCaja = async () => {
      if (!user) return;
      try {
        const res = await api.get("cierres/abiertas/");
        const cierre = Array.isArray(res.data) ? res.data[0] : res.data;
        if (cierre && cierre.estado === "ABIERTO") {
          setCajaAbierta(true);
          setEstado("ABIERTO");
          setCierreId(cierre.id);
        } else {
          setCajaAbierta(false);
          setEstado("CERRADO");
          setCierreId(null);
        }
      } catch {
        setCajaAbierta(false);
        setEstado("CERRADO");
        setCierreId(null);
      }
    };
    verificarCaja();
  }, [user]);

  // --- Cargar resumen de cierre activo ---
  useEffect(() => {
    const loadResumen = async () => {
      if (cajaAbierta && cierreId) {
        try {
          const r = await api.get(`cierres/${cierreId}/resumen/`);
          const t = r.data?.totales || {};
          setResumen({
            anulados: t.total_anulados || 0,
            gastos: t.total_gastos || 0,
            ventas: t.total_ventas || 0,
            efectivo: t.total_efectivo || 0,
            tarjeta: t.total_tarjeta || 0,
            qr: t.total_qr || 0,
            transferencia: t.total_transferencia || 0,
            cortesia: t.total_cortesias || t.total_cortesia || 0,
            descuentos: t.total_descuentos || t.total_descuento || 0,
            cantidad_anulados: t.cantidad_anulados || 0,
          });
        } catch {
          setResumen(estadoInicialResumen);
        }
      } else setResumen(estadoInicialResumen);
    };
    loadResumen();
  }, [cajaAbierta, cierreId]);

  // --- Aperturar caja ---
  const handleAperturar = async () => {
    try {
      const _usuarioId = user?.id;
      const _almacenId =
        typeof user?.almacen === "object"
          ? user.almacen.id
          : Number.isInteger(user?.almacen)
          ? user.almacen
          : null;
      const _almacenNombre =
        typeof user?.almacen === "object"
          ? user.almacen.nombre_almacen
          : user?.almacen || "Desconocido";
      const almacenParam = _almacenId || _almacenNombre;
      if (!_usuarioId || !almacenParam) {
        alert("❌ Faltan datos de usuario o almacén.");
        return;
      }
      const parse = parseFloat(montoApertura);
      const monto_inicial = isNaN(parse) ? 0 : Math.max(0, parse);
      const payload = {
        usuario: _usuarioId,
        almacen: almacenParam,
        turno: user?.turno_activo || 1,
        monto_inicial,
        observaciones: descripcion?.trim() || "",
      };
      const res = await api.post("cierres/abrir/", payload);
      const nuevoCierre = res.data;
      setCierreId(nuevoCierre.id);
      setCajaAbierta(true);
      setEstado("ABIERTO");
      alert("✅ Caja aperturada correctamente");
      setModalOpen(false);
      setDescripcion("");
      setMontoApertura("");
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Error desconocido";
      alert("❌ Error al aperturar: " + msg);
    }
  };

  // --- Cerrar caja ---
  const handleCerrar = async () => {
    try {
      if (!cierreId) return alert("No hay caja activa para cerrar.");
      await api.post(`cierres/${cierreId}/cerrar/`, {
        observaciones: descripcion,
      });
      alert("🧾 Caja cerrada correctamente");
      setCajaAbierta(false);
      setEstado("CERRADO");
      setModalOpen(false);
      setDescripcion("");
      setResumen(estadoInicialResumen);
    } catch (err) {
      const msg =
        err.response?.data?.detail || err.response?.data?.error || "Error";
      alert("❌ Error al cerrar: " + msg);
    }
  };

  // --- Card elegante tipo "botoncito" ---
  const CardTotal = ({ titulo, valor }) => (
    <Tooltip title={titulo} arrow>
      <Card
        sx={{
          minWidth: 180,
          textAlign: "center",
          borderRadius: 3,
          px: 1,
          py: 0.5,
          transition: "all 0.25s ease",
          cursor: "pointer",
          background: theme.palette.mode === "dark"
            ? "linear-gradient(145deg, #1b1b1b, #262626)"
            : "linear-gradient(145deg, #ffffff, #f3f3f3)",
          boxShadow: theme.palette.mode === "dark"
            ? "4px 4px 8px rgba(0,0,0,0.6), -4px -4px 8px rgba(255,255,255,0.05)"
            : "4px 4px 10px rgba(0,0,0,0.1), -4px -4px 10px rgba(255,255,255,0.6)",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: theme.palette.mode === "dark"
              ? "6px 6px 12px rgba(0,0,0,0.8), -4px -4px 12px rgba(255,255,255,0.1)"
              : "6px 6px 12px rgba(0,0,0,0.15), -4px -4px 12px rgba(255,255,255,0.8)",
            background: theme.palette.mode === "dark"
              ? "linear-gradient(145deg, #1f1f1f, #2a2a2a)"
              : "linear-gradient(145deg, #fafafa, #ffffff)",
          },
        }}
      >
        <CardContent sx={{ py: 1.5 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              letterSpacing: "0.4px",
              color:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.8)"
                  : "rgba(0,0,0,0.7)",
            }}
          >
            {titulo}
          </Typography>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              mt: 0.5,
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.success.light
                  : theme.palette.success.dark,
              textShadow:
                theme.palette.mode === "dark"
                  ? "0 0 8px rgba(0,255,100,0.25)"
                  : "0 0 6px rgba(0,150,0,0.1)",
            }}
          >
            {Number(valor || 0).toFixed(2)} Bs
          </Typography>
        </CardContent>
      </Card>
    </Tooltip>
  );

  // --- UI ---
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h4" fontWeight="bold" sx={{ my: 2 }}>
        🧮 Panel de Caja
      </Typography>

      {/* Tarjetas principales */}
      <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
        <Grid item>
          <CardTotal titulo="TOTAL ANULADOS" valor={resumen.anulados} />
        </Grid>
        <Grid item>
          <CardTotal titulo="TOTAL GASTOS" valor={resumen.gastos} />
        </Grid>
        <Grid item>
          <CardTotal titulo="TOTAL CORTESÍAS" valor={resumen.cortesia} />
        </Grid>
        <Grid item>
          <CardTotal titulo="TOTAL DESCUENTOS" valor={resumen.descuentos || 0} />
        </Grid>
        <Grid item>
          <CardTotal titulo="TOTAL VENTAS" valor={resumen.ventas} />
        </Grid>
        <Grid item>
          <CardTotal
            titulo="TOTAL EN CAJA"
            valor={(Number(resumen.ventas || 0) - Number(resumen.gastos || 0)).toFixed(2)}
          />
        </Grid>
      </Grid>

      {/* Estado */}
      <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: "wrap", alignItems: "center" }}>
        <Chip
          label={estado === "ABIERTO" ? "Caja ABIERTA" : "Caja CERRADA"}
          color={estado === "ABIERTO" ? "success" : "default"}
          sx={{ fontWeight: "bold" }}
        />
        {cierreId && <Chip label={`Cierre #${cierreId}`} variant="outlined" />}
        {almacenId && <Chip label={`Almacén ID: ${almacenId}`} variant="outlined" />}
        {user?.turno?.nombre && (
          <Chip label={`Turno: ${user.turno.nombre}`} color="info" variant="outlined" />
        )}
      </Stack>

      {!cajaAbierta ? (
        <Button variant="contained" color="success" onClick={() => setModalOpen(true)}>
          Aperturar Caja
        </Button>
      ) : (
        <Button variant="contained" color="error" onClick={() => setModalOpen(true)}>
          Cerrar Caja
        </Button>
      )}

      {/* --- Modal --- */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fullScreen={fullScreen}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: { xs: 1.5, sm: 2.5 },
            bgcolor: theme.palette.mode === "dark" ? "#121212" : "#fefefe",
            boxShadow: theme.palette.mode === "dark"
              ? "0 0 25px rgba(255,255,255,0.05)"
              : "0 8px 30px rgba(0,0,0,0.2)",
            maxWidth: "700px",
            mx: "auto",
            transition: "all 0.3s ease",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: 800,
            fontSize: "1.7rem",
            borderBottom: "1px solid",
            borderColor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.1)",
            pb: 1.5,
            color: theme.palette.mode === "dark" ? "#fff" : "#222",
            background: theme.palette.mode === "dark"
              ? "linear-gradient(90deg, #212121, #181818)"
              : "linear-gradient(90deg, #fff, #f7f7f7)",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
          }}
        >
          {cajaAbierta ? "🧾 Cierre de Caja" : "💵 Apertura de Caja"}
        </DialogTitle>

        <DialogContent sx={{ mt: 3, px: 3, pb: 3 }}>
          {!cajaAbierta ? (
            <>
              <Typography variant="h6" textAlign="center" mb={2}>
                Ingreso de Monto Inicial
              </Typography>
              <TextField
                label="Monto de apertura (opcional)"
                type="number"
                fullWidth
                value={montoApertura}
                onChange={(e) => setMontoApertura(e.target.value)}
                inputProps={{ min: 0, step: "0.01" }}
                placeholder="0.00"
                helperText="Si lo dejas vacío se registrará 0"
                sx={{ mb: 2 }}
              />
              <TextField
                label="Observaciones"
                fullWidth
                multiline
                minRows={2}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Ej: Inicio del turno..."
              />
            </>
          ) : (
            <>
              <Typography variant="h6" textAlign="center" mb={2}>
                Resumen del Cierre
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
                <CardTotal titulo="TOTAL VENTAS" valor={resumen.ventas} />
                <CardTotal
                  titulo="EFECTIVO (neto)"
                  valor={(Number(resumen.efectivo || 0) - Number(resumen.gastos || 0)).toFixed(2)}
                />
                <CardTotal titulo="TARJETA" valor={resumen.tarjeta} />
                <CardTotal titulo="QR" valor={resumen.qr} />
                <CardTotal titulo="TRANSFERENCIA" valor={resumen.transferencia} />
                <CardTotal titulo="GASTOS" valor={resumen.gastos} />
                <CardTotal titulo="ANULADOS" valor={resumen.anulados} />
              </Stack>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 2, textAlign: "center" }}
              >
                Cantidad de anulados: <b>{resumen.cantidad_anulados ?? 0}</b>
              </Typography>

              <TextField
                label="Observaciones de Cierre"
                fullWidth
                multiline
                minRows={2}
                sx={{ mt: 2 }}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Ej: Caja cuadrada, turno sin incidencias..."
              />
            </>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2,
            justifyContent: "space-between",
            borderTop: "1px solid",
            borderColor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.1)",
          }}
        >
          <Button onClick={() => setModalOpen(false)} variant="outlined" color="inherit">
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={cajaAbierta ? handleCerrar : handleAperturar}
            color={cajaAbierta ? "error" : "success"}
            sx={{
              fontWeight: "bold",
              px: 4,
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": { transform: "scale(1.03)" },
            }}
          >
            {cajaAbierta ? "Cerrar Caja" : "Aperturar Caja"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
