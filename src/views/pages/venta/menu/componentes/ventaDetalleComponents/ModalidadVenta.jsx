import { Box, Typography, RadioGroup, FormControlLabel, Radio, TextField } from "@mui/material";

export default function ModalidadVenta({
  tipoVenta,
  setTipoVenta,
  datosVenta,
  handleDatosVentaChange,
}) {
  return (
    <Box display="flex" gap={2}>
      {/* --- Selector de modalidad --- */}
      <Box width="35%">
        <Typography fontWeight="bold" fontSize={14}>
          Modalidad
        </Typography>
        <RadioGroup
          value={tipoVenta}
          onChange={(e) => setTipoVenta(e.target.value)}
        >
          <FormControlLabel value="mesa" control={<Radio />} label="Mesa" />
          <FormControlLabel value="llevar" control={<Radio />} label="Para llevar" />
          <FormControlLabel value="delivery" control={<Radio />} label="Delivery" />
        </RadioGroup>
      </Box>

      {/* --- Campos dinámicos según tipo de venta --- */}
      <Box width="65%">
        {tipoVenta === "mesa" && (
          <>
            <TextField
              fullWidth
              size="small"
              label="Número de Mesa"
              value={datosVenta.numeroMesa}
              onChange={handleDatosVentaChange("numeroMesa")}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              size="small"
              label="Descripción"
              value={datosVenta.descripcion}
              onChange={handleDatosVentaChange("descripcion")}
              sx={{ mb: 1 }}
            />
          </>
        )}

        {tipoVenta === "llevar" && (
          <>
            <TextField
              fullWidth
              size="small"
              label="Nombre"
              value={datosVenta.nombreCliente}
              onChange={handleDatosVentaChange("nombreCliente")}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              size="small"
              label="Descripción"
              value={datosVenta.descripcion}
              onChange={handleDatosVentaChange("descripcion")}
              sx={{ mb: 1 }}
            />
          </>
        )}

        {tipoVenta === "delivery" && (
          <>
            <TextField
              fullWidth
              size="small"
              label="Teléfono"
              value={datosVenta.telefono}
              onChange={handleDatosVentaChange("telefono")}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              size="small"
              label="Dirección"
              value={datosVenta.direccion}
              onChange={handleDatosVentaChange("direccion")}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              size="small"
              label="Descripción"
              value={datosVenta.descripcion}
              onChange={handleDatosVentaChange("descripcion")}
              sx={{ mb: 1 }}
            />
          </>
        )}

        {/* --- Campo común de Observaciones --- */}
        <TextField
          fullWidth
          size="small"
          label="Observaciones"
          multiline
          minRows={2}
          value={datosVenta.observaciones}
          onChange={handleDatosVentaChange("observaciones")}
          placeholder="Ej: Sin cebolla, con extra queso, entregar rápido..."
        />
      </Box>
    </Box>
  );
}
