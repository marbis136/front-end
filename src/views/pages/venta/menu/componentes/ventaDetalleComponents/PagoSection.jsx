import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";
import { useState, useMemo } from "react";

const METODOS = [
  { key: "efectivo", label: "EFECTIVO" },
  { key: "qr", label: "QR" },
  { key: "tarjeta", label: "TARJETA" },
  { key: "transferencia", label: "TRANSFERENCIA" },
];

export default function PagoSection({
  total,
  splits,
  toggleMetodo,
  setMonto,
  setEntregado,
  setTarjeta,
  setReferencia,
  getSplit,
  totalAsignado,
  formPagoValido,
  onConfirmarCobro,
  cobroConfirmado,
  onDescuentoChange,
  esCortesia = false, // 🟢 nuevo prop
}) {
  // -----------------------------
  // 🟢 Estados descuento
  // -----------------------------
  const [modalDescuento, setModalDescuento] = useState(false);
  const [descPorcentaje, setDescPorcentaje] = useState("");
  const [descMonto, setDescMonto] = useState("");
  const [motivo, setMotivo] = useState("");
  const [descuentoAplicado, setDescuentoAplicado] = useState(null);

  // -----------------------------
  // 💰 Cálculos del descuento
  // -----------------------------
  const descuentoCalculado = useMemo(() => {
    const porcentaje = parseFloat(descPorcentaje) || 0;
    const monto = parseFloat(descMonto) || 0;

    let descuento = 0;
    if (porcentaje > 0) descuento = (total * porcentaje) / 100;
    else if (monto > 0) descuento = monto;

    if (descuento > total) descuento = total;
    return descuento;
  }, [descPorcentaje, descMonto, total]);

  // 🔹 Redondeo inteligente
  const redondear = (num) => {
    const parte = num - Math.floor(num);
    return parte >= 0.5 ? Math.ceil(num) : Math.floor(num);
  };

  const totalConDescuento = Math.max(0, total - descuentoCalculado);
  const totalPagar = redondear(totalConDescuento);

  const faltante = Math.max(0, totalPagar - Math.round(totalAsignado));

  const aplicarDescuento = () => {
    const nuevo = {
      porcentaje: parseFloat(descPorcentaje) || 0,
      monto: parseFloat(descMonto) || 0,
      motivo: motivo.trim(),
      valorFinal: descuentoCalculado,
    };

    setDescuentoAplicado(nuevo);
    setModalDescuento(false);
    if (onDescuentoChange) onDescuentoChange(nuevo);
  };

  const descuentoTexto = descuentoAplicado
    ? descuentoAplicado.porcentaje > 0
      ? `${descuentoAplicado.porcentaje}%`
      : `Bs. ${descuentoAplicado.monto}`
    : "Ninguno";

  // -----------------------------
  // 🧠 Helpers
  // -----------------------------
  const limpiarCeros = (val) => val.replace(/^0+(?=\d)/, "");

  // -----------------------------
  // 🔹 UI principal
  // -----------------------------
  return (
    <>
      {/* Encabezado */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography fontWeight="bold" fontSize={16}>
          PAGO
        </Typography>

        {esCortesia ? (
          <Typography variant="h6" fontWeight="bold" color="success.main">
            Bs. 0 (CORTESÍA)
          </Typography>
        ) : (
          <>
            <Button
              variant={descuentoAplicado ? "contained" : "outlined"}
              color="secondary"
              size="small"
              onClick={() => setModalDescuento(true)}
            >
              {descuentoAplicado ? "Editar Descuento" : "Aplicar Descuento"}
            </Button>
            <Typography variant="h6" fontWeight="bold" color="primary">
              TOTAL A PAGAR: {totalPagar} Bs
            </Typography>
          </>
        )}
      </Box>

      {!esCortesia && descuentoAplicado && (
        <Typography variant="body2" color="text.secondary" mb={1}>
          Descuento: <strong>{descuentoTexto}</strong>{" "}
          {descuentoAplicado.motivo && `— ${descuentoAplicado.motivo}`}
        </Typography>
      )}

      {/* Contenido */}
      <Box display="flex" gap={2}>
        {/* Botones de métodos */}
        <Box flex={1}>
          {METODOS.map(({ key, label }) => {
            const activo = !!getSplit(key);
            return (
              <Button
                key={key}
                fullWidth
                variant={activo ? "contained" : "outlined"}
                onClick={() => {
                  if (!activo && (faltante <= 0 || esCortesia)) return;

                  const asignado = Math.round(totalAsignado);
                  const restante = Math.max(0, totalPagar - asignado);

                  toggleMetodo(key);
                  setMonto(key, restante);
                }}
                disabled={!activo && (faltante <= 0 || esCortesia)}
                sx={{ textTransform: "none", fontSize: "12px", mb: 0.4 }}
              >
                {label}
              </Button>
            );
          })}
        </Box>

        {/* Detalle dinámico */}
        <Box flex={2} display="flex" flexDirection="column" gap={1}>
          {esCortesia ? (
            <Typography variant="body2" color="text.secondary">
              Modo cortesía: no se requieren pagos.
            </Typography>
          ) : splits.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Selecciona un método de pago.
            </Typography>
          ) : (
            splits.map((s) => {
              const asignadoActual =
                Math.round(totalAsignado) - Math.round(s.monto || 0);
              const maxPermitido = Math.max(1, totalPagar - asignadoActual);
              const cambioCalc =
                s.metodo === "efectivo"
                  ? (s.entregado || 0) - (s.monto || 0)
                  : 0;

              return (
                <Box
                  key={s.metodo}
                  sx={{
                    p: 1,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                  }}
                >
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography fontWeight="bold">
                      {METODOS.find((m) => m.key === s.metodo)?.label}
                    </Typography>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => toggleMetodo(s.metodo)}
                    >
                      Quitar
                    </Button>
                  </Box>

                  {/* Monto */}
                  <TextField
                    fullWidth
                    label="Monto"
                    type="text"
                    size="small"
                    value={s.monto ?? maxPermitido}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "");
                      val = limpiarCeros(val);
                      if (!val) val = "0";

                      let num = parseInt(val, 10);
                      if (num > maxPermitido) num = maxPermitido;
                      if (num < 1) num = 1;

                      num = redondear(num);
                      setMonto(s.metodo, num);
                    }}
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    sx={{ mb: s.metodo === "efectivo" ? 1 : 0 }}
                  />

                  {/* Efectivo */}
                  {s.metodo === "efectivo" && (
                    <>
                      <TextField
                        fullWidth
                        label="Entregado"
                        type="text"
                        size="small"
                        value={s.entregado ?? ""}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, "");
                          val = limpiarCeros(val);
                          if (!val) val = "0";

                          let num = parseInt(val, 10);
                          if (num < 0) num = 0;

                          num = redondear(num);
                          setEntregado("efectivo", num);
                        }}
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                        sx={{ mt: 1 }}
                      />
                      <Typography
                        fontSize={14}
                        fontWeight="bold"
                        color={cambioCalc >= 0 ? "success.main" : "error.main"}
                      >
                        {cambioCalc >= 0
                          ? `Cambio: ${cambioCalc} Bs`
                          : `Faltante: -${Math.abs(cambioCalc)} Bs`}
                      </Typography>
                    </>
                  )}

                  {/* QR */}
                  {s.metodo === "qr" && (
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{ mt: 1 }}
                      onClick={() => alert("Generar QR")}
                    >
                      Generar Código QR
                    </Button>
                  )}

                  {/* Tarjeta */}
                  {s.metodo === "tarjeta" && (
                    <TextField
                      fullWidth
                      label="Número de Tarjeta"
                      type="text"
                      placeholder="#### #### #### #### "
                      size="small"
                      value={(() => {
                        // mostrar siempre con formato ####-####-####-####
                        const raw = (s.tarjeta ?? "").replace(/\D/g, "");
                        return raw.replace(/(\d{4})(?=\d)/g, "$1  ");
                      })()}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, ""); // solo números

                        // Paso 1: si el usuario escribe los primeros 4 → completar con 8 ceros
                        if (val.length === 4) {
                          val = val + "00000000";
                        }

                        // Paso 2: limitar máximo a 16 dígitos
                        if (val.length > 16) {
                          val = val.slice(0, 16);
                        }

                        setTarjeta("tarjeta", val); // guardamos sin guiones
                      }}
                      inputProps={{
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                        maxLength: 22, // 16 dígitos + 3 guiones
                      }}
                      sx={{ mt: 1 }}
                    />
                  )}

                  {/* Transferencia */}
                  {s.metodo === "transferencia" && (
                    <TextField
                      fullWidth
                      label="Referencia"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  )}
                </Box>
              );
            })
          )}

          {/* Resumen */}
          {!esCortesia && (
            <>
              <Typography fontSize={14}>
                Asignado: {Math.round(totalAsignado)} / {totalPagar} Bs
              </Typography>
              <Button
                variant="contained"
                disabled={!formPagoValido || cobroConfirmado}
                onClick={onConfirmarCobro}
              >
                Confirmar Cobro
              </Button>
              {cobroConfirmado && (
                <Typography fontSize={13} color="success.main">
                  Cobro confirmado
                </Typography>
              )}
            </>
          )}
        </Box>
      </Box>

      {/* Modal Descuento */}
      {!esCortesia && (
        <Dialog open={modalDescuento} onClose={() => setModalDescuento(false)} fullWidth>
          <DialogTitle>Aplicar Descuento</DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField
                label="Descuento (%)"
                type="number"
                value={descPorcentaje}
                onChange={(e) => {
                  let val = parseFloat(e.target.value) || 0;
                  if (val < 0) val = 0;
                  if (val > 100) val = 100;
                  val = redondear(val);
                  setDescPorcentaje(val);
                  setDescMonto("");
                }}
                fullWidth
              />
              <TextField
                label="Descuento (Bs.)"
                type="number"
                value={descMonto}
                onChange={(e) => {
                  let val = parseFloat(e.target.value) || 0;
                  if (val < 0) val = 0;
                  if (val > total) val = total;
                  val = redondear(val);
                  setDescMonto(val);
                  setDescPorcentaje("");
                }}
                fullWidth
              />
              <TextField
                label="Motivo"
                multiline
                minRows={2}
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                fullWidth
              />
              <Typography fontSize={14} color="text.secondary">
                Descuento calculado: Bs. {descuentoCalculado.toFixed(2)}
              </Typography>
              <Typography fontSize={14} fontWeight="bold" color="primary">
                Nuevo total: Bs. {totalPagar.toFixed(2)}
              </Typography>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setModalDescuento(false)}>Cancelar</Button>
            <Button variant="contained" onClick={aplicarDescuento}>
              Aplicar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
