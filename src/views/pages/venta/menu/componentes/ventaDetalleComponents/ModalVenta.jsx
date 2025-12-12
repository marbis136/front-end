import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Grid,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { useReactToPrint } from "react-to-print";
import api from "../../../../../../api/axios";
import { useAuth } from "../../../../../../auth/AuthContext";

import CustomCard from "./CustomCard";
import DatosCliente from "./DatosCliente";
import ModalidadVenta from "./ModalidadVenta";
import DetallePedido from "./DetallePedido";
import PagoSection from "./PagoSection";
import ModalCortesia from "./ModalCortesia";

export default function ModalVenta({ open, onClose, total, onConfirm, items = [] }) {
  const { user } = useAuth();

  // ---------------- Estados ----------------
  const [tipoIdentidad, setTipoIdentidad] = useState("ci");
  const [tipoVenta, setTipoVenta] = useState("mesa");
  const [imprimirFactura, setImprimirFactura] = useState(false);
  const [enviarFactura, setEnviarFactura] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openCortesia, setOpenCortesia] = useState(false);

  const [datosVenta, setDatosVenta] = useState({
    numeroMesa: "",
    descripcion: "",
    nombreCliente: "",
    telefono: "",
    direccion: "",
    observaciones: "",
  });

  const [formData, setFormData] = useState({
    nit: "",
    nombre: "",
    correo: "",
    telefono: "",
    codigo: "",
  });

  const [splits, setSplits] = useState([]);
  const [cobroConfirmado, setCobroConfirmado] = useState(false);
  const [descuento, setDescuento] = useState({ porcentaje: 0, monto: 0, motivo: "" });
  const [esCortesia, setEsCortesia] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const prevOpen = useRef(open);
  useEffect(() => {
    if (!prevOpen.current && open) {
      setCobroConfirmado(false);
      setEsCortesia(false);
      setDescuento({ porcentaje: 0, monto: 0, motivo: "" });
    }
    prevOpen.current = open;
  }, [open]);

  // ---------------- Impresión ----------------
  const ticketRef = useRef();
  const handlePrint = useReactToPrint({
    contentRef: ticketRef,
    documentTitle: `Ticket-${Date.now()}`,
  });

  // ---------------- Funciones auxiliares ----------------
  const getSplit = (m) => splits.find((s) => s.metodo === m);
  const totalAsignado = splits.reduce((acc, s) => acc + (Number(s.monto) || 0), 0);

  const toggleMetodo = (metodo) => {
    setSplits((prev) => {
      const ya = prev.find((s) => s.metodo === metodo);
      if (ya) return prev.filter((s) => s.metodo !== metodo);

      const faltante = Math.max(0, total - totalAsignado);
      let inicial = { metodo, monto: faltante };

      if (metodo === "efectivo") inicial = { ...inicial, entregado: 0, cambio: 0 };
      if (metodo === "tarjeta") inicial = { ...inicial, tarjeta: "" };
      if (metodo === "transferencia") inicial = { ...inicial, referencia: "" };

      return [...prev, inicial];
    });
  };

  const setMonto = (metodo, monto) =>
    setSplits((prev) =>
      prev.map((s) =>
        s.metodo === metodo ? { ...s, monto: Math.max(0, Number(monto) || 0) } : s
      )
    );

  const setEntregado = (metodo, entregado) =>
    setSplits((prev) =>
      prev.map((s) =>
        s.metodo === metodo
          ? {
              ...s,
              entregado: Math.max(0, Number(entregado) || 0),
              cambio: Math.max(0, Number(entregado) - Number(s.monto || 0)),
            }
          : s
      )
    );

  const setTarjeta = (metodo, value) =>
    setSplits((prev) =>
      prev.map((s) => (s.metodo === metodo ? { ...s, tarjeta: value } : s))
    );

  const setReferencia = (metodo, value) =>
    setSplits((prev) =>
      prev.map((s) => (s.metodo === metodo ? { ...s, referencia: value } : s))
    );

  const datosClienteValidos =
    formData.nit.trim() !== "" && formData.nombre.trim() !== "";

  const formPagoValido = useMemo(() => {
    if (esCortesia) return true;
    if (total <= 0) return false;
    if (splits.length === 0) return false;
    if (Math.round(totalAsignado) !== Math.round(total - (descuento?.monto || 0)))
      return false;

    for (let s of splits) {
      if (!s.monto || s.monto <= 0) return false;
      if (s.metodo === "efectivo" && (!s.entregado || s.entregado < s.monto))
        return false;
      if (s.metodo === "tarjeta" && (!s.tarjeta || s.tarjeta.length < 4))
        return false;
      if (s.metodo === "transferencia" && (!s.referencia || s.referencia.trim() === ""))
        return false;
    }
    return true;
  }, [splits, total, totalAsignado, descuento, esCortesia]);

  // ---------------- Crear venta ----------------
  const handleConfirmVenta = async () => {
    if ((!cobroConfirmado && !esCortesia) || (!datosClienteValidos && !esCortesia))
      return;

    setLoading(true);
    try {
      let tipoVentaTexto = "";
      let observaciones = datosVenta.observaciones?.trim() || "";

      if (tipoVenta === "mesa") {
        tipoVentaTexto = `MESA ${datosVenta.numeroMesa || ""}`.trim();
      } else if (tipoVenta === "llevar") {
        tipoVentaTexto = `PARA LLEVAR ${datosVenta.nombreCliente || ""}`.trim();
      } else if (tipoVenta === "delivery") {
        const partes = [];
        if (datosVenta.telefono) partes.push(`Tel: ${datosVenta.telefono}`);
        if (datosVenta.direccion) partes.push(`Dir: ${datosVenta.direccion}`);
        tipoVentaTexto = `DELIVERY ${partes.join(" | ")}`.trim();
      }

      const payload = {
        total_venta: total,
        total_neto: esCortesia ? 0 : Math.max(0, total - (descuento?.monto || 0)),
        descuento_total: descuento?.monto || 0,
        motivo_descuento: descuento?.motivo || "",
        tipo_venta: esCortesia ? "CORTESIA" : "NORMAL",
        tipo_operacion: tipoVentaTexto,
        forma_pago: esCortesia
          ? "CORTESÍA"
          : splits.map((s) => s.metodo.toUpperCase()).join(" + "),
        observaciones,
        cliente: formData.codigo || null,
        detalles: items.map((item) => ({
          producto: item.prod1,
          descripcion: item.descripcion || "",
          tipo: item.tipo || "",
          cantidad: Number(item.cantidad) || 1,
          precio_unitario: Number(item.price) || 0,
          subtotal: (Number(item.price) || 0) * (Number(item.cantidad) || 1),
        })),
        pagos: esCortesia
          ? []
          : splits.map((s) => ({
              forma_pago: s.metodo.toUpperCase(),
              monto: s.monto,
              banco: s.tarjeta || null,
              numero_operacion: s.referencia || null,
            })),
      };

      const response = await api.post("/venta/", payload);

      if (imprimirFactura) await handlePrint();

      setSnackbar({
        open: true,
        message: "✅ Venta registrada correctamente",
        severity: "success",
      });

      api.get("/menu-precio/").then((res) => {
        window.dispatchEvent(new CustomEvent("refrescarProductos", { detail: res.data }));
      });

      // 🔹 Notificar a CarritoSection y limpiar todo
      onConfirm(response.data);

      // 🔄 Reset de todos los estados del modal
      setTipoIdentidad("ci");
      setTipoVenta("mesa");
      setImprimirFactura(false);
      setEnviarFactura(false);
      setDatosVenta({
        numeroMesa: "",
        descripcion: "",
        nombreCliente: "",
        telefono: "",
        direccion: "",
        observaciones: "",
      });
      setFormData({
        nit: "",
        nombre: "",
        correo: "",
        telefono: "",
        codigo: "",
      });
      setSplits([]);
      setCobroConfirmado(false);
      setDescuento({ porcentaje: 0, monto: 0, motivo: "" });
      setEsCortesia(false);

      // ⏱️ Cerrar modal tras 1s
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      console.error("❌ Error guardando venta:", err.response?.data || err);
      const data = err.response?.data;
      let message = "Error al guardar la venta. Intenta nuevamente.";
      let severity = "error";
      if (data && typeof data === "object") {
        if (data.detalle?.includes("Stock insuficiente")) {
          message = data.detalle;
          severity = "warning";
        } else if (data.detalle) {
          message = data.detalle;
        }
      }
      setSnackbar({ open: true, message, severity });
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Render ----------------
  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <CustomCard>
                <DatosCliente
                  tipoIdentidad={tipoIdentidad}
                  setTipoIdentidad={setTipoIdentidad}
                  formData={formData}
                  handleFormDataChange={(campo) => (e) =>
                    setFormData((prev) => ({ ...prev, [campo]: e.target.value }))}
                />
              </CustomCard>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomCard>
                <ModalidadVenta
                  tipoVenta={tipoVenta}
                  setTipoVenta={setTipoVenta}
                  datosVenta={datosVenta}
                  handleDatosVentaChange={(campo) => (e) =>
                    setDatosVenta((prev) => ({ ...prev, [campo]: e.target.value }))}
                />
              </CustomCard>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomCard>
                <DetallePedido items={items} />
              </CustomCard>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomCard>
                <PagoSection
                  total={esCortesia ? 0 : total}
                  splits={splits}
                  toggleMetodo={toggleMetodo}
                  setMonto={setMonto}
                  setEntregado={setEntregado}
                  setTarjeta={setTarjeta}
                  setReferencia={setReferencia}
                  getSplit={getSplit}
                  totalAsignado={totalAsignado}
                  formPagoValido={formPagoValido}
                  onConfirmarCobro={() => setCobroConfirmado(true)}
                  cobroConfirmado={cobroConfirmado}
                  onDescuentoChange={setDescuento}
                  esCortesia={esCortesia}
                />
              </CustomCard>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={imprimirFactura}
                  onChange={(e) => setImprimirFactura(e.target.checked)}
                />
              }
              label="Imprimir factura"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={enviarFactura}
                  onChange={(e) => setEnviarFactura(e.target.checked)}
                />
              }
              label="Enviar factura"
            />
          </Box>

          <Box>
            <Button onClick={() => setOpenCortesia(true)} color="warning" variant="contained">
              Cortesía
            </Button>

            <Button onClick={handlePrint} color="info" variant="outlined" sx={{ mr: 1 }}>
              Test Print
            </Button>

            <Button
              onClick={handleConfirmVenta}
              color="success"
              variant="contained"
              disabled={
                (!cobroConfirmado && !esCortesia) ||
                (!datosClienteValidos && !esCortesia) ||
                loading
              }
            >
              {loading ? "Guardando..." : "Confirmar Venta"}
            </Button>

            <Button onClick={onClose} color="error" variant="contained">
              Cancelar
            </Button>
          </Box>
        </DialogActions>

        <ModalCortesia
          open={openCortesia}
          onClose={() => setOpenCortesia(false)}
          onGuardar={(motivo) => {
            setDescuento({
              porcentaje: 100,
              monto: total,
              motivo: `Cortesía - ${motivo}`,
            });
            setEsCortesia(true);
            setCobroConfirmado(true);
            setSnackbar({
              open: true,
              message: `Cortesía registrada: ${motivo}`,
              severity: "info",
            });
          }}
        />
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
