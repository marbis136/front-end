import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button, Grid } from "@mui/material";
import api from "../../../../../../api/axios"; // tu cliente axios configurado con tokens

export default function UserModalPassword({ open, onClose, user, onUpdated }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  if (!user) return null;

  const handleSave = async () => {
    if (!password) {
      alert("La contraseña no puede estar vacía");
      return;
    }
    if (password !== confirm) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      await api.patch(`/usuarios/${user.id}/`, { password });
      alert("✅ Contraseña actualizada correctamente");
      setPassword("");
      setConfirm("");
      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      console.error("❌ Error cambiando contraseña:", err.response?.data || err.message);
      alert("No se pudo actualizar la contraseña");
    }
  };

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
          borderRadius: 2,
          boxShadow: 24,
          width: 400,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Cambiar Contraseña
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nueva Contraseña"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Confirmar Contraseña"
              type="password"
              fullWidth
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={handleSave}
            >
              Guardar
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
