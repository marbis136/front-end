import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Grid, Avatar, MenuItem } from '@mui/material';
import api from '../../../../../../api/axios'; // tu cliente axios con token

export default function UserModalEdit({ open, onClose, user, onUpdated }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    correo: '',
    login: '',
    ci: '',
    password: '',
    confirmPassword: '',
    rol: '',
    almacen: '',
    estado: '',
    foto_usuario: null
  });

  const [roles, setRoles] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [estados, setEstados] = useState([]);

  // cargar valores iniciales al abrir modal
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        apellido_paterno: user.apellido_paterno || '',
        apellido_materno: user.apellido_materno || '',
        correo: user.correo || '',
        login: user.login || '',
        ci: user.ci || '',
        password: '',
        confirmPassword: '',
        rol: user.rol || '',
        almacen: user.almacen || '',
        estado: user.estado || '',
        foto_usuario: user.foto_usuario || null
      });
    }
  }, [user]);

  // cargar selects desde backend
  useEffect(() => {
    api.get('/roles/').then((res) => setRoles(res.data));
    api.get('/almacenes/').then((res) => setAlmacenes(res.data));
    api.get('/estados/').then((res) => setEstados(res.data));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(',')[1];
        setFormData({ ...formData, foto_usuario: base64Data });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const payload = { ...formData };
    delete payload.confirmPassword;

    try {
      const res = await api.patch(`/usuarios/${user.id}/`, payload);

      if (onUpdated) onUpdated(res.data); // ⬅️ pasamos el usuario actualizado
      onClose();
    } catch (err) {
      console.error('❌ Error actualizando usuario:', err.response?.data || err.message);
      alert('No se pudo actualizar el usuario');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'white',
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          width: 500,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <Typography variant="h6" gutterBottom>
          Editar Usuario
        </Typography>

        <Grid container spacing={2}>
          {/* Foto */}
          <Grid item xs={12} textAlign="center">
            <Avatar
              src={formData.foto_usuario ? `data:image/jpeg;base64,${formData.foto_usuario}` : null}
              sx={{ width: 120, height: 120, mb: 2, mx: 'auto' }}
            />
            <Button variant="contained" component="label" color="secondary">
              Cambiar Foto
              <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
            </Button>
          </Grid>

          {/* Datos personales */}
          <Grid item xs={12} md={6}>
            <TextField label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Apellido Paterno"
              name="apellido_paterno"
              value={formData.apellido_paterno}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Apellido Materno"
              name="apellido_materno"
              value={formData.apellido_materno}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="CI" name="ci" value={formData.ci} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Correo" name="correo" value={formData.correo} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Login" name="login" value={formData.login} onChange={handleChange} fullWidth />
          </Grid>

          {/* Password */}
          <Grid item xs={12} md={6}>
            <TextField
              type="password"
              label="Nueva Contraseña"
              name="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              type="password"
              label="Confirmar Contraseña"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          {/* Selects */}
          <Grid item xs={12} md={4}>
            <TextField select label="Rol" name="rol" value={formData.rol || ''} onChange={handleChange} fullWidth>
              {roles.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  {r.nombre_rol}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField select label="Almacén" name="almacen" value={formData.almacen || ''} onChange={handleChange} fullWidth>
              {almacenes.map((a) => (
                <MenuItem key={a.id_almacen} value={a.id_almacen}>
                  {a.nombre_almacen}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField select label="Estado" name="estado" value={formData.estado || ''} onChange={handleChange} fullWidth>
              {estados.map((e) => (
                <MenuItem key={e.id_estado} value={e.id_estado}>
                  {e.nombre_estado}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Botón guardar */}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth onClick={handleSave}>
              Guardar Cambios
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
