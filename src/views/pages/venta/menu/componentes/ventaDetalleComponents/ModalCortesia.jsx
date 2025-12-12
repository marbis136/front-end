import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Stack,
  Autocomplete,
} from "@mui/material";
import { useState } from "react";

export default function ModalCortesia({ open, onClose, onGuardar }) {
  const [motivo, setMotivo] = useState("");
  const [valor, setValor] = useState("");
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

  const empleados = [
    { id: 1, nombre: "Juan Pérez" },
    { id: 2, nombre: "Ana Gómez" },
    { id: 3, nombre: "Carlos Torres" },
  ];

  const handleConfirmar = () => {
    let motivoFinal = "";

    switch (motivo) {
      case "cliente":
        motivoFinal = valor.trim() ? `Cliente: ${valor}` : "";
        break;
      case "empleado":
        motivoFinal = empleadoSeleccionado
          ? `Empleado: ${empleadoSeleccionado.nombre}`
          : "";
        break;
      case "dueño":
        motivoFinal = valor.trim() ? `Dueño: ${valor}` : "";
        break;
      case "otro":
        motivoFinal = valor.trim() ? valor.trim() : "";
        break;
      default:
        motivoFinal = "";
    }

    if (!motivoFinal) {
      alert("Completa la información del motivo antes de guardar.");
      return;
    }

    onGuardar(motivoFinal);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Registrar cortesía</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <RadioGroup
            value={motivo}
            onChange={(e) => {
              setMotivo(e.target.value);
              setValor("");
              setEmpleadoSeleccionado(null);
            }}
          >
            <FormControlLabel value="cliente" control={<Radio />} label="Cliente" />
            <FormControlLabel value="empleado" control={<Radio />} label="Empleado" />
            <FormControlLabel value="dueño" control={<Radio />} label="Dueño" />
            <FormControlLabel value="otro" control={<Radio />} label="Otro" />
          </RadioGroup>

          {motivo === "cliente" && (
            <TextField
              label="Descripción del cliente"
              fullWidth
              size="small"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          )}

          {motivo === "empleado" && (
            <Autocomplete
              options={empleados}
              getOptionLabel={(opt) => opt.nombre}
              value={empleadoSeleccionado}
              onChange={(e, nuevo) => setEmpleadoSeleccionado(nuevo)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Buscar empleado"
                  size="small"
                />
              )}
            />
          )}

          {motivo === "dueño" && (
            <TextField
              label="Nombre del dueño"
              fullWidth
              size="small"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          )}

          {motivo === "otro" && (
            <TextField
              label="Motivo personalizado"
              fullWidth
              size="small"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" color="success" onClick={handleConfirmar}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
