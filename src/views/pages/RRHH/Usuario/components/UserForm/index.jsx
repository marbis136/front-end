import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Grid,
  MenuItem,
  Button,
  Avatar,
  Typography,
  Box
} from '@mui/material';
import api from '../../../../../../api/axios';
import { gridSpacing } from '../../../../../../store/constant';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// 🔹 funciones de fetch para catálogos
const fetchRoles = async () => (await api.get('/rol/')).data;
const fetchAlmacenes = async () => (await api.get('/almacen/')).data;

export default function UserForm({ onClose }) {
  // --- campos del usuario ---
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [ci, setCi] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [rol, setRol] = useState('');
  const [almacen, setAlmacen] = useState('');
  const [estado, setEstado] = useState('ACTIVO');
  const [foto, setFoto] = useState(null);

  const queryClient = useQueryClient();

  // --- Cargar listas ---
  const { data: roles = [] } = useQuery({ queryKey: ['rol'], queryFn: fetchRoles, staleTime: 1000 * 60 * 10 });
  const { data: almacenes = [] } = useQuery({ queryKey: ['almacen'], queryFn: fetchAlmacenes, staleTime: 1000 * 60 * 10 });

  // --- Subir foto ---
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setFoto(reader.result.split(',')[1]);
    reader.readAsDataURL(file);
  };

  // --- Guardar usuario ---
  const handleSave = async () => {
    const payload = {
      username: username?.trim().toUpperCase(),
      password,
      nombre,
      apellido_paterno: apellidoPaterno,
      apellido_materno: apellidoMaterno || null,
      ci,
      correo,
      telefono: telefono || null,
      rol: rol || null,
      almacen: almacen || null,
      estado,
      foto_personal: foto
    };

    try {
      const res = await api.post('/usuario/', payload);
      console.log('✅ Usuario creado:', res.data);
      queryClient.invalidateQueries(['usuario']);

      // limpiar
      setUsername('');
      setPassword('');
      setNombre('');
      setApellidoPaterno('');
      setApellidoMaterno('');
      setCi('');
      setCorreo('');
      setTelefono('');
      setRol('');
      setAlmacen('');
      setEstado('ACTIVO');
      setFoto(null);

      if (onClose) onClose();
    } catch (err) {
      console.error('❌ Error creando usuario:', err.response?.data || err.message);
      alert('No se pudo crear el usuario. Verifica los campos o duplicados.');
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Crear Usuario
      </Typography>

      <Grid container spacing={gridSpacing}>
        {/* Columna izquierda - Foto */}
        <Grid item xs={12} md={3} textAlign="center">
          <Avatar
            src={foto ? `data:image/jpeg;base64,${foto}` : null}
            sx={{ width: 160, height: 160, mb: 2, mx: 'auto' }}
          />
          <Button variant="contained" component="label" color="secondary" sx={{ mr: 1, mb: 1 }}>
            Subir
            <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
          </Button>
          <Button variant="contained" component="label" color="primary" sx={{ mb: 1 }}>
            Cámara
            <input type="file" hidden accept="image/*" capture="environment" onChange={handlePhotoUpload} />
          </Button>
        </Grid>

        {/* Columna derecha - Datos */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Usuario (Login)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="password"
                label="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Apellido Paterno"
                value={apellidoPaterno}
                onChange={(e) => setApellidoPaterno(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Apellido Materno"
                value={apellidoMaterno}
                onChange={(e) => setApellidoMaterno(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="CI / NIT"
                value={ci}
                onChange={(e) => setCi(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                select
                label="Rol"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                fullWidth
                required
              >
                {roles.map((r) => (
                  <MenuItem key={r.id} value={r.nombre_rol}>
                    {r.nombre_rol}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                select
                label="Almacén"
                value={almacen}
                onChange={(e) => setAlmacen(e.target.value)}
                fullWidth
                required
              >
                {almacenes.map((a) => (
                  <MenuItem key={a.id} value={a.nombre_almacen}>
                    {a.nombre_almacen}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                select
                label="Estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                fullWidth
              >
                <MenuItem value="ACTIVO">Activo</MenuItem>
                <MenuItem value="INACTIVO">Inactivo</MenuItem>
                <MenuItem value="SUSPENDIDO">Suspendido</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Botón Guardar */}
      <Box textAlign="right" sx={{ mt: 3 }}>
        <Button variant="contained" color="success" size="medium" onClick={handleSave}>
          Guardar Usuario
        </Button>
      </Box>
    </Paper>
  );
}
