import {
  Grid,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import api from "../../../../../../api/axios";

export default function DatosCliente({
  tipoIdentidad,
  setTipoIdentidad,
  formData,
  handleFormDataChange,
}) {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [clienteNoExiste, setClienteNoExiste] = useState(false);

  // 🔹 Buscar cliente por código
  const handleKeyDownCodigo = async (e) => {
    if (e.key === "Enter" && formData.codigo.trim()) {
      setLoading(true);
      try {
        const res = await api.get(`/cliente/codigo/${formData.codigo}/`);
        if (res.status === 200) {
          const cliente = res.data;
          handleFormDataChange("codigo")({ target: { value: cliente.codigo_cliente || "" } });
          handleFormDataChange("nit")({ target: { value: cliente.ci_nit?.toString() || "" } });
          handleFormDataChange("nombre")({ target: { value: cliente.name_cliente || "" } });
          handleFormDataChange("correo")({ target: { value: cliente.email || "" } });
          handleFormDataChange("telefono")({
            target: { value: cliente.telefono?.replace("+591", "") || "" },
          });
          handleFormDataChange("direccion")({ target: { value: cliente.direccion || "" } });
          handleFormDataChange("observaciones")({
            target: { value: cliente.observaciones || "" },
          });
          handleFormDataChange("fecha_nacimiento")({
            target: { value: cliente.fecha_nacimiento || "" },
          });
          setClienteNoExiste(false);
          console.log("Cliente encontrado ✅");
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setClienteNoExiste(true);
          console.log("Cliente no encontrado ❌ → mostrar botón Nuevo");
        } else {
          console.error("Error buscando cliente:", err);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // 🔹 Crear nuevo cliente
  const handleCreateCliente = async () => {
    const nuevoCliente = {
      codigo_cliente: formData.codigo || `CL-${Date.now()}`,
      name_cliente: formData.nombre,
      ci_nit: formData.nit,
      email: formData.correo,
      telefono: `+591${formData.telefono}`,
      direccion: formData.direccion,
      observaciones: formData.observaciones,
      fecha_nacimiento: formData.fecha_nacimiento || null,
    };

    try {
      const res = await api.post("/cliente/", nuevoCliente);
      const cliente = res.data;

      handleFormDataChange("codigo")({ target: { value: cliente.codigo_cliente } });
      handleFormDataChange("nit")({ target: { value: cliente.ci_nit } });
      handleFormDataChange("nombre")({ target: { value: cliente.name_cliente } });
      handleFormDataChange("correo")({ target: { value: cliente.email } });
      handleFormDataChange("telefono")({
        target: { value: cliente.telefono?.replace("+591", "") },
      });
      handleFormDataChange("direccion")({ target: { value: cliente.direccion } });
      handleFormDataChange("observaciones")({ target: { value: cliente.observaciones } });
      handleFormDataChange("fecha_nacimiento")({
        target: { value: cliente.fecha_nacimiento },
      });

      setModalOpen(false);
      setClienteNoExiste(false);
      console.log("Cliente creado ✅");
    } catch (err) {
      console.error("Error creando cliente:", err.response?.data || err);
      alert("Error al crear cliente");
    }
  };

  // 🔹 Actualizar cliente existente
  const handleUpdate = async () => {
    if (!formData.codigo) return;
    const updateData = {
      codigo_cliente: formData.codigo,
      name_cliente: formData.nombre,
      ci_nit: formData.nit,
      email: formData.correo,
      telefono: `+591${formData.telefono}`,
      direccion: formData.direccion,
      observaciones: formData.observaciones,
      fecha_nacimiento: formData.fecha_nacimiento || null,
    };
    try {
      await api.put(`/cliente/codigo/${formData.codigo}/`, updateData);
      console.log("Cliente actualizado ✅");
    } catch (err) {
      console.error("Error actualizando cliente:", err.response?.data || err);
    }
  };

  return (
    <>
      {/* 🔹 Código Cliente */}
      <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <Grid item xs={8} sm={4}>
          <Typography fontWeight="bold" fontSize={13}>
            Código Cliente
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={formData.codigo}
            onChange={handleFormDataChange("codigo")}
            onKeyDown={handleKeyDownCodigo}
            placeholder="Ej: CL-001"
            sx={{ maxWidth: 180 }}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={4} sm={2}>
          {clienteNoExiste && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              sx={{ mt: 3, ml: 1 }}
              onClick={() => setModalOpen(true)}
            >
              Nuevo
            </Button>
          )}
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography fontWeight="bold" fontSize={13}>
            Tipo de Identidad
          </Typography>
          <RadioGroup
            row
            value={tipoIdentidad}
            onChange={(e) => setTipoIdentidad(e.target.value)}
            sx={{ mt: 0.5 }}
          >
            <FormControlLabel value="ci" control={<Radio size="small" />} label="CI" />
            <FormControlLabel value="nit" control={<Radio size="small" />} label="NIT" />
            <FormControlLabel value="pasaporte" control={<Radio size="small" />} label="Pasaporte" />
          </RadioGroup>
        </Grid>
      </Grid>

      {/* Otros campos */}
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <Typography fontWeight="bold" fontSize={13}>
            CI / NIT
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={formData.nit}
            onChange={handleFormDataChange("nit")}
            onBlur={handleUpdate}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography fontWeight="bold" fontSize={13}>
            Nombre / Razón Social
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={formData.nombre}
            onChange={handleFormDataChange("nombre")}
            onBlur={handleUpdate}
          />
        </Grid>
      </Grid>

      {/* Correo y Teléfono */}
      <Grid container spacing={1} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6}>
          <Typography fontWeight="bold" fontSize={13}>
            Correo
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={formData.correo}
            onChange={handleFormDataChange("correo")}
            onBlur={handleUpdate}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography fontWeight="bold" fontSize={13}>
            Teléfono
          </Typography>
          <PhoneInput
            country={"bo"}
            onlyCountries={["bo"]}
            disableDropdown
            countryCodeEditable={false}
            value={formData.telefono}
            onChange={(value) => {
              handleFormDataChange("telefono")({ target: { value } });
              handleUpdate();
            }}
            inputStyle={{ width: "100%", height: "40px", fontSize: "14px" }}
            containerStyle={{ width: "100%" }}
          />
        </Grid>
      </Grid>

      {/* 🔹 Modal Crear Cliente */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Nuevo Cliente</DialogTitle>
        <DialogContent>
          <Grid container spacing={1} sx={{ mt: 1 }}>
            {[
              { key: "codigo", label: "Código Cliente" },
              { key: "nombre", label: "Nombre / Razón Social" },
              { key: "nit", label: "CI / NIT" },
              { key: "correo", label: "Correo" },
              { key: "telefono", label: "Teléfono" },
              { key: "direccion", label: "Dirección" },
              { key: "observaciones", label: "Observaciones" },
            ].map((field) => (
              <Grid item xs={12} key={field.key}>
                <TextField
                  fullWidth
                  label={field.label}
                  value={formData[field.key]}
                  onChange={handleFormDataChange(field.key)}
                  size="small"
                />
              </Grid>
            ))}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Fecha de Nacimiento"
                type="date"
                InputLabelProps={{ shrink: true }}
                size="small"
                value={formData.fecha_nacimiento || ""}
                onChange={handleFormDataChange("fecha_nacimiento")}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreateCliente}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
