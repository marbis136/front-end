import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Card,
  CardContent,
  Typography,
  Grid,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import BlockIcon from '@mui/icons-material/Block';
import PersonIcon from '@mui/icons-material/Person';

export default function UserTable({ usuarios, onEdit, onChangePassword, onInactivate, onViewProfile, mobile }) {
  if (mobile) {
    return (
      <Paper sx={{ p: 2, xs:12 }}>
        <Box>
          <Grid container spacing={2}>
            {usuarios.map((u) => (
              <Grid item xs={12} key={u.id}>
                <Card>
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <Avatar src={u.foto_usuario ? `data:image/jpeg;base64,${u.foto_usuario}` : null} sx={{ width: 100, height: 100 }} />
                      </Grid>
                      <Grid item xs>
                        <Typography variant="h6">
                          {u.nombre} {u.apellido_paterno} {u.apellido_materno}
                        </Typography>
                        <Typography variant="body2">{u.correo}</Typography>
                        <Typography variant="body2">
                          User: {u.login} | CI: {u.ci}
                        </Typography>
                        <Typography variant="body2">
                          Almacén: {u.almacen_nombre || u.almacen} | Rol: {u.rol_nombre || u.rol}
                        </Typography>
                        {u.estado_nombre || u.estado}
                      </Grid>
                      <Grid item>
                        <Tooltip title="Editar">
                          <IconButton onClick={() => onEdit(u)}>
                            <EditIcon color="primary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Contraseña">
                          <IconButton onClick={() => onChangePassword(u)}>
                            <LockIcon color="secondary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={u.estado_nombre === 'Activo' ? 'Inactivar' : 'Activar'}>
                          <IconButton onClick={() => onToggleEstado(u)}>
                            <BlockIcon color={u.estado_nombre === 'Activo' ? 'error' : 'success'} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Perfil">
                          <IconButton onClick={() => onViewProfile(u)}>
                            <PersonIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>
    );
  }

  // Desktop: tabla
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Foto</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Apellidos</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Login</TableCell>
            <TableCell>CI</TableCell>
            <TableCell>Almacén</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usuarios.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.id}</TableCell>
              <TableCell>
                <Avatar src={u.foto_usuario ? `data:image/jpeg;base64,${u.foto_usuario}` : null} />
              </TableCell>
              <TableCell>{u.nombre}</TableCell>
              <TableCell>
                {u.apellido_paterno} {u.apellido_materno}
              </TableCell>
              <TableCell>{u.correo}</TableCell>
              <TableCell>{u.username}</TableCell>
              <TableCell>{u.ci}</TableCell>
              <TableCell>{u.almacen_nombre || u.almacen}</TableCell>
              <TableCell>{u.rol_nombre || u.rol}</TableCell>
              <TableCell>{u.estado_nombre || u.estado}</TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(u)}>
                  <EditIcon color="primary" />
                </IconButton>
                <IconButton onClick={() => onChangePassword(u)}>
                  <LockIcon color="secondary" />
                </IconButton>
                <IconButton onClick={() => onInactivate(u)}>
                  <BlockIcon color="error" />
                </IconButton>
                <IconButton onClick={() => onViewProfile(u)}>
                  <PersonIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
