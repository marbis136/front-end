import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../../../../auth/AuthContext";

import {
  Typography,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import LoadingOverlay from "../../components/LoadingOverlay";
import ErrorModal from "../../components/ErrorModal";

// 🎨 Estilos reutilizables para inputs con underline
const underlineSx = (colors) => ({
  input: { color: colors.text },
  label: { color: colors.sub },
  "& .MuiInput-underline:before": {
    borderBottomColor: colors.sub + "66",
  },
  "& .MuiInput-underline:hover:before": {
    borderBottomColor: colors.sub,
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#5df3ff",
  },
});

export default function LoginForm({ colors }) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const from = state?.from?.pathname || "/";

  const { login } = useAuth();

  // Estados locales
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔐 Enviar formulario
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Se actualiza login() para recibir { username, password }
      await login({ username, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError({
        title: "Error de autenticación",
        message: err.message || "No se pudo iniciar sesión. Verifica tus credenciales.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay de carga */}
      {loading && <LoadingOverlay message="Ingresando..." />}

      {/* Modal de error */}
      <ErrorModal
        open={!!error}
        onClose={() => setError(null)}
        title={error?.title}
        message={error?.message}
      />

      <form onSubmit={handleLogin}>
        <Typography
          variant="h4"
          sx={{ color: colors.text, fontWeight: 800, mb: 2 }}
        >
          Iniciar sesión
        </Typography>

        {/* Campo usuario */}
        <TextField
          fullWidth
          variant="standard"
          label="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <PersonOutlineOutlinedIcon sx={{ color: colors.sub }} />
              </InputAdornment>
            ),
          }}
          sx={underlineSx(colors)}
        />

        {/* Campo contraseña */}
        <TextField
          fullWidth
          variant="standard"
          type="password"
          label="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <LockOutlinedIcon sx={{ color: colors.sub }} />
              </InputAdornment>
            ),
          }}
          sx={{ ...underlineSx(colors), mt: 3 }}
        />

        {/* Botón de envío */}
        <Button
          type="submit"
          fullWidth
          disabled={loading}
          sx={{
            mt: 4,
            py: 1.4,
            fontWeight: 700,
            color: "#02242f",
            borderRadius: 999,
            background:
              "linear-gradient(180deg, #57f7ff 0%, #1de0f2 60%, #00c2d6 100%)",
            boxShadow:
              "0 6px 18px rgba(0, 224, 255, 0.35), inset 0 -2px 0 rgba(0,0,0,0.2)",
            "&:hover": {
              boxShadow:
                "0 8px 24px rgba(0, 224, 255, 0.45), inset 0 -2px 0 rgba(0,0,0,0.25)",
              transform: "translateY(-1px)",
            },
            transition: "all .2s ease",
          }}
        >
          {loading ? "Ingresando..." : "Entrar"}
        </Button>
      </form>
    </>
  );
}
