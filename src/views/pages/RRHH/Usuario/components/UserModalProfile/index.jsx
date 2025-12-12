import React from "react";
import {
  Modal,
  Box,
  Typography,
  Avatar,
  Grid,
  Divider,
  Button,
} from "@mui/material";

export default function UserModalProfile({ open, onClose, user }) {
  if (!user) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          p: 4,
          borderRadius: 3,
          boxShadow: 24,
          width: 450,
        }}
      >
        {/* Foto */}
        <Grid container direction="column" alignItems="center">
          <Avatar
            src={user.foto_usuario ? `data:image/jpeg;base64,${user.foto_usuario}` : null}
            sx={{ width: 120, height: 120, mb: 2 }}
          />
          <Typography variant="h6">
            {user.nombre} {user.apellido_paterno} {user.apellido_materno}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.rol_nombre || user.rol} - {user.estado_nombre || user.estado}
          </Typography>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Info */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Usuario</Typography>
            <Typography>{user.login}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Email</Typography>
            <Typography>{user.correo}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">CI</Typography>
            <Typography>{user.ci}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Almacén</Typography>
            <Typography>{user.almacen_nombre || user.almacen}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Rol</Typography>
            <Typography>{user.rol_nombre || user.rol}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Estado</Typography>
            <Typography>{user.estado_nombre || user.estado}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Botón cerrar */}
        <Box textAlign="center">
          <Button variant="contained" color="primary" onClick={onClose}>
            Cerrar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
