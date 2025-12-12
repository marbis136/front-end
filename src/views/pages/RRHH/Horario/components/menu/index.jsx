import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  Paper,
  Box
} from "@mui/material";
import SubCard from "../../../../../../ui-component/cards/SubCard";
import api from "../../../../../../api/axios"; // tu helper axios

export default function MenuForm({ onClose }) {
  const [nombreMenu, setNombreMenu] = useState("");
  const [codigoMenu, setCodigoMenu] = useState("");
  const [sucursal, setSucursal] = useState("");
  const [estado, setEstado] = useState("");
  const [subclasificacion, setSubclasificacion] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // listas que vienen de la API
  const [sucursales, setSucursales] = useState([]);
  const [estados, setEstados] = useState([]);
  const [subclasificaciones, setSubclasificaciones] = useState([]);

  // cargar datos al montar
  useEffect(() => {
    api.get("/sucursales/").then((res) => setSucursales(res.data));
    api.get("/estados/").then((res) => setEstados(res.data));
    api.get("/menusubclasificaciones/").then((res) => setSubclasificaciones(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/menu/", {
        nombre_menu: nombreMenu,
        codigo_menu: codigoMenu,
        sucursal,
        estado,
        subclasificacion,
        descripcion,
      });
      if (onClose) onClose();
    } catch (err) {
      console.error("Error creando menú", err);
    }
  };

  return (
    <SubCard title="Crear Menú">
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre del menú"
                fullWidth
                value={nombreMenu}
                onChange={(e) => setNombreMenu(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Código del menú"
                fullWidth
                value={codigoMenu}
                onChange={(e) => setCodigoMenu(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Sucursal"
                fullWidth
                value={sucursal}
                onChange={(e) => setSucursal(e.target.value)}
                required
              >
                {sucursales.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.nombre_sucursal}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Estado"
                fullWidth
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                required
              >
                {estados.map((eItem) => (
                  <MenuItem key={eItem.id} value={eItem.id}>
                    {eItem.nombre_estado}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                label="Sub clasificación"
                fullWidth
                value={subclasificacion}
                onChange={(e) => setSubclasificacion(e.target.value)}
                required
              >
                {subclasificaciones.map((sub) => (
                  <MenuItem key={sub.id} value={sub.id}>
                    {sub.nombre_subclasificacion}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Descripción"
                multiline
                rows={3}
                fullWidth
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="submit" variant="contained" color="primary">
                Guardar
              </Button>
              <Button onClick={onClose} sx={{ ml: 2 }}>
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </SubCard>
  );
}
