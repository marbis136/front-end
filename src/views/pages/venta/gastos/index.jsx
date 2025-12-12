import React, { useMemo, useState, useEffect, memo } from "react";
import {
  Box, Grid, Card, CardContent, Typography,
  TextField, Select, MenuItem, Button,
  ToggleButton, ToggleButtonGroup,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Stack, Chip
} from "@mui/material";
import PieChartIcon from "@mui/icons-material/PieChart";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import StoreIcon from "@mui/icons-material/Store";
import api from "../../../../api/axios";
import { useAuth } from "../../../../auth/AuthContext";

// 🔹 Proveedores frecuentes base
const proveedoresFrecuentes = [
  { id: 1, nombre: "Coca-Cola" },
  { id: 2, nombre: "Pil Andina" },
  { id: 3, nombre: "Hipermaxi" },
  { id: 4, nombre: "Ketal" },
  { id: 5, nombre: "Imba" },
];

const empleadosCatalogo = ["Juan", "María", "Pedro", "Lucía"];

/* =========================================================
   TARJETA PROVEEDORES FRECUENTES (independiente)
   ========================================================= */
const TarjetaProveedoresFijos = memo(function TarjetaProveedoresFijos({
  proveedores,
  cajaAbierta,
  formProv,
  setFormProv,
  onAgregarProveedor,
}) {
  const handleMontoInput = (e) => {
    let val = e.target.value.replace(",", ".").replace(/[^\d.]/g, "");
    if ((val.match(/\./g) || []).length > 1) val = val.replace(/\.+$/, "");
    setFormProv((s) => ({ ...s, monto: val }));
  };

  const botonDeshabilitado =
    !cajaAbierta || !formProv.proveedor || !formProv.monto;

  return (
    <Card sx={{ backgroundColor: "#fff8e1", borderRadius: 3, boxShadow: 4, mt: 3 }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <StoreIcon color="warning" fontSize="large" />
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#ef6c00" }}>
            Proveedores Frecuentes
          </Typography>
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
          <Select
            displayEmpty
            size="small"
            value={formProv.proveedor}
            onChange={(e) => setFormProv((s) => ({ ...s, proveedor: e.target.value }))}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value=""><em>Selecciona proveedor</em></MenuItem>
            {proveedores.map((p) => (
              <MenuItem key={p.id} value={p.nombre}>{p.nombre}</MenuItem>
            ))}
          </Select>

          <TextField
            label="Monto"
            type="number"
            inputMode="decimal"
            size="small"
            value={formProv.monto}
            onChange={handleMontoInput}
            sx={{ width: 150 }}
            inputProps={{ step: "0.01", min: "0" }}
          />

          <Button
            variant="contained"
            color="warning"
            disabled={botonDeshabilitado}
            onClick={onAgregarProveedor}
          >
            Agregar
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
});

/* =========================================================
   TARJETA DE CATEGORÍAS
   ========================================================= */
const TarjetaCategorias = memo(function TarjetaCategorias({
  categoriaUI,
  setCategoriaUI,
  formProducto,
  setFormProducto,
  formAdelanto,
  setFormAdelanto,
  empleadosCatalogo,
  onAgregarProducto,
  onAgregarAdelanto,
  cajaAbierta,
}) {
  const handleMontoInput = (e, setter) => {
    let val = e.target.value.replace(",", ".").replace(/[^\d.]/g, "");
    if ((val.match(/\./g) || []).length > 1) val = val.replace(/\.+$/, "");
    setter((s) => ({ ...s, monto: val }));
  };

  const botonDeshabilitadoProducto =
    !cajaAbierta || !formProducto.descripcion || !formProducto.monto;
  const botonDeshabilitadoAdelanto =
    !cajaAbierta || !formAdelanto.empleado || !formAdelanto.monto;

  return (
    <Card sx={{ backgroundColor: "#e8eaf6", borderRadius: 3, boxShadow: 4 }}>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
          <PieChartIcon fontSize="large" />
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Gastos por Categoría
          </Typography>
        </Stack>

        {/* 🔹 Botones */}
        <Stack direction="row" justifyContent="center" sx={{ mb: 2 }}>
          <ToggleButtonGroup
            exclusive
            value={categoriaUI}
            onChange={(_, v) => v && setCategoriaUI(v)}
            size="small"
            color="primary"
          >
            <ToggleButton value="INSUMO">Pago por producto</ToggleButton>
            <ToggleButton value="ADELANTO">Adelantos</ToggleButton>
            <ToggleButton value="TRANSPORTE">Transporte</ToggleButton>
            <ToggleButton value="OTRO">Otros</ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        {/* 🔹 Formularios */}
        {categoriaUI === "ADELANTO" ? (
          <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
            <Select
              displayEmpty
              size="small"
              value={formAdelanto.empleado}
              onChange={(e) => setFormAdelanto((s) => ({ ...s, empleado: e.target.value }))}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value=""><em>Selecciona empleado</em></MenuItem>
              {empleadosCatalogo.map((emp) => (
                <MenuItem key={emp} value={emp}>{emp}</MenuItem>
              ))}
            </Select>

            <TextField
              label="Monto"
              type="number"
              inputMode="decimal"
              value={formAdelanto.monto}
              onChange={(e) => handleMontoInput(e, setFormAdelanto)}
              size="small"
              sx={{ width: 150 }}
              inputProps={{ step: "0.01", min: "0" }}
            />
            <Button
              variant="contained"
              color="primary"
              disabled={botonDeshabilitadoAdelanto}
              onClick={onAgregarAdelanto}
            >
              Agregar
            </Button>
          </Stack>
        ) : (
          <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
            <TextField
              label="Descripción"
              value={formProducto.descripcion}
              onChange={(e) => setFormProducto((s) => ({ ...s, descripcion: e.target.value }))}
              size="small"
              fullWidth
            />
            <TextField
              label="Monto"
              type="number"
              inputMode="decimal"
              value={formProducto.monto}
              onChange={(e) => handleMontoInput(e, setFormProducto)}
              size="small"
              sx={{ width: 150 }}
              inputProps={{ step: "0.01", min: "0" }}
            />
            <Button
              variant="contained"
              color="primary"
              disabled={botonDeshabilitadoProducto}
              onClick={onAgregarProducto}
            >
              Agregar
            </Button>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
});

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */
export default function Gastos() {
  const { user } = useAuth();
  const [transacciones, setTransacciones] = useState([]);
  const [cierreActivo, setCierreActivo] = useState(null);
  const [cajaAbierta, setCajaAbierta] = useState(false);
  const [almacenId, setAlmacenId] = useState(null);
  const [almacenNombre, setAlmacenNombre] = useState("Desconocido");
  const [categoriaUI, setCategoriaUI] = useState("INSUMO");

  const [formProducto, setFormProducto] = useState({ descripcion: "", monto: "" });
  const [formAdelanto, setFormAdelanto] = useState({ empleado: "", monto: "" });
  const [formProv, setFormProv] = useState({ proveedor: "", monto: "" });

  /* =========================================================
     Cargar Cierre Activo del Usuario
     ========================================================= */
  useEffect(() => {
    const fetchCierreUsuario = async () => {
      try {
        const res = await api.get("cierres/abiertas/");
        const cierre = Array.isArray(res.data) ? res.data[0] : res.data;

        if (cierre && cierre.estado === "ABIERTO") {
          setCierreActivo(cierre.id);
          setCajaAbierta(true);
        } else {
          setCajaAbierta(false);
          setCierreActivo(null);
        }

        // 🔹 Detectar ID o nombre del almacén
        let aid = null;
        let nombre = "Desconocido";
        if (typeof user?.almacen === "object" && user.almacen?.id) {
          aid = user.almacen.id;
          nombre = user.almacen.nombre_almacen || "Sin nombre";
        } else if (Number.isInteger(user?.almacen)) {
          aid = user.almacen;
        } else if (typeof user?.almacen === "string") {
          nombre = user.almacen;
        }

        setAlmacenId(aid);
        setAlmacenNombre(nombre);

        // 🔹 Cargar gastos del cierre actual
        if (cierre?.id) {
          const gastosRes = await api.get("gasto/", { params: { cierre: cierre.id } });
          setTransacciones(gastosRes.data);
        } else {
          setTransacciones([]);
        }
      } catch (err) {
        console.error("❌ Error al cargar gastos/cierre:", err);
        setTransacciones([]);
      }
    };
    fetchCierreUsuario();
  }, [user]);

  const parseMonto = (m) => parseFloat(m?.toString().replace(",", ".") || 0);

  const registrarGasto = async (payload) => {
    try {
      const res = await api.post("gasto/", payload);
      setTransacciones((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error("❌ Error registrando gasto:", err.response?.data || err);
      alert("Error al registrar gasto");
    }
  };

  const agregarPagoProducto = async () => {
    if (!cajaAbierta || !cierreActivo) return alert("No hay caja activa.");
    const { descripcion, monto } = formProducto;
    if (!descripcion || !monto) return alert("Completa descripción y monto.");
    const payload = { descripcion, monto: parseMonto(monto), categoria: categoriaUI, cierre: cierreActivo };
    await registrarGasto(payload);
    setFormProducto({ descripcion: "", monto: "" });
  };

  const agregarAdelanto = async () => {
    if (!cajaAbierta || !cierreActivo) return alert("No hay caja activa.");
    const { empleado, monto } = formAdelanto;
    if (!empleado || !monto) return alert("Completa empleado y monto.");
    const payload = { descripcion: `Adelanto - ${empleado}`, monto: parseMonto(monto), categoria: "ADELANTO", cierre: cierreActivo };
    await registrarGasto(payload);
    setFormAdelanto({ empleado: "", monto: "" });
  };

  const agregarProveedor = async () => {
    if (!cajaAbierta || !cierreActivo) return alert("No hay caja activa.");
    const { proveedor, monto } = formProv;
    if (!proveedor || !monto) return alert("Completa proveedor y monto.");
    const payload = { descripcion: `Pago proveedor - ${proveedor}`, monto: parseMonto(monto), categoria: "INSUMO", cierre: cierreActivo };
    await registrarGasto(payload);
    setFormProv({ proveedor: "", monto: "" });
  };

  const totalGastos = useMemo(() =>
    transacciones.reduce((acc, t) => acc + parseFloat(t.monto || 0), 0),
    [transacciones]
  );

  return (
    <Box p={2}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
        💸 Gestión de Gastos
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Chip label={cajaAbierta ? "Caja ABIERTA" : "Caja CERRADA"} color={cajaAbierta ? "success" : "default"} />
        {cierreActivo && <Chip label={`Cierre #${cierreActivo}`} variant="outlined" />}
        {almacenId
          ? <Chip label={`Almacén #${almacenId}`} variant="outlined" />
          : <Chip label={`Almacén: ${almacenNombre}`} variant="outlined" />}
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: "#fce4ec", borderRadius: 3, boxShadow: 4 }}>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
                <TrendingDownIcon fontSize="large" />
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>Detalle de Gastos</Typography>
              </Stack>

              <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 320 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Categoría</TableCell>
                      <TableCell align="right">Monto</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transacciones.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{r.descripcion}</TableCell>
                        <TableCell>{r.categoria}</TableCell>
                        <TableCell align="right">{Number(r.monto || 0).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    {!transacciones.length && (
                      <TableRow>
                        <TableCell colSpan={3} align="center">Sin registros</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="h4" sx={{ mt: 2, textAlign: "center" }}>
                Total: {totalGastos.toFixed(2)} Bs
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <TarjetaCategorias
            categoriaUI={categoriaUI}
            setCategoriaUI={setCategoriaUI}
            formProducto={formProducto}
            setFormProducto={setFormProducto}
            formAdelanto={formAdelanto}
            setFormAdelanto={setFormAdelanto}
            empleadosCatalogo={empleadosCatalogo}
            onAgregarProducto={agregarPagoProducto}
            onAgregarAdelanto={agregarAdelanto}
            cajaAbierta={cajaAbierta}
          />
          {/* Tarjeta fija de proveedores */}
          <TarjetaProveedoresFijos
            proveedores={proveedoresFrecuentes}
            cajaAbierta={cajaAbierta}
            formProv={formProv}
            setFormProv={setFormProv}
            onAgregarProveedor={agregarProveedor}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
