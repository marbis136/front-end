import React, { useState } from 'react';
import { Box, Grid, Button, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ApiAxios from '../../../../api/axios';
import UserForm from '../Usuario/components/UserForm';
import UserTable from '../Usuario/components/UserTable';
import UserModalEdit from '../Usuario/components/UserModalEdit';
import UserModalPassword from '../Usuario/components/UserModalPassword';
import UserModalProfile from '../Usuario/components/UserModalProfile';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// 🔹 función para traer usuarios
const fetchUsuarios = async () => {
  const res = await ApiAxios.get('/usuario/');
  return res.data;
};

export default function UsuariosPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const queryClient = useQueryClient();

  // 🔹 React Query para usuarios
  const { data: usuarios = [], isLoading } = useQuery({
    queryKey: ['usuario'],
    queryFn: fetchUsuarios,
    staleTime: 1000 * 60 * 5 // cache 5 min
  });

  // ✅ actualizar un usuario en cache
  const handleUserUpdated = (updatedUser) => {
    queryClient.setQueryData(['usuario'], (old = []) => old.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  };

  // ✅ crear usuario → refrescar lista en cache
  const handleUserCreated = () => {
    setOpenCreate(false);
    queryClient.invalidateQueries(['usuario']);
  };

  // ✅ activar / inactivar usuario
  const handleToggleEstado = async (user) => {
    try {
      const nuevoEstado = user.estado_nombre === 'Activo' ? 2 : 1;
      // ⚠️ Ajusta según tus IDs de estado
      const res = await api.patch(`/usuario/${user.id}/`, { estado: nuevoEstado });

      // actualizar cache
      queryClient.setQueryData(['usuario'], (old = []) => old.map((u) => (u.id === user.id ? res.data : u)));
    } catch (err) {
      console.error('❌ Error cambiando estado:', err.response?.data || err.message);
      alert('No se pudo cambiar el estado del usuario');
    }
  };


  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Botón crear solo visible en mobile */}
      {isMobile && (
        <Button variant="contained" color="secondary" onClick={() => setOpenCreate(true)}>
          Crear Usuario
        </Button>
      )}

      <Grid container spacing={5} sx={{ mt: 3 }}>
        {/* Formulario en desktop */}
        {!isMobile && (
          <Grid item xs={12}>
            <UserForm onClose={handleUserCreated} desktop />
          </Grid>
        )}

        {/* Tabla de usuarios */}
        <Grid item xs={12}>
          <UserTable
            usuarios={usuarios}
            onEdit={(u) => {
              setSelectedUser(u);
              setOpenEdit(true);
            }}
            onChangePassword={(u) => {
              setSelectedUser(u);
              setOpenPassword(true);
            }}
            onToggleEstado={handleToggleEstado}
            onViewProfile={(u) => {
              setSelectedUser(u);
              setOpenProfile(true);
            }}
            mobile={isMobile}
          />
        </Grid>
      </Grid>

      {/* Modales */}
      <UserModalEdit open={openEdit} onClose={() => setOpenEdit(false)} user={selectedUser} onUpdated={handleUserUpdated} />
      <UserModalPassword open={openPassword} onClose={() => setOpenPassword(false)} user={selectedUser} />
      <UserModalProfile open={openProfile} onClose={() => setOpenProfile(false)} user={selectedUser} />

      {/* Modal crear usuario en mobile */}
      {isMobile && <UserForm open={openCreate} onClose={handleUserCreated} />}
    </Box>
  );
}
