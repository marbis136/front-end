// src/views/pages/auth-forms/Login.jsx
import { Box, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ModeToggle from "./components/ModeToggle";
import LoginForm from "./components/LoginForm"; // 👈 nuevo componente

export default function Login() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const colors = isDark
    ? {
        bg: "#061b26",
        panelBg:
          "linear-gradient(180deg, rgba(13,32,45,0.85) 0%, rgba(12,29,41,0.85) 100%)",
        text: "#e6f7ff",
        sub: "#9ad7e0",
        glow:
          "0 0 0 1px rgba(0,255,255,0.18), 0 0 28px rgba(0, 217, 255, 0.35), inset 0 0 0 1px rgba(255,255,255,0.04)",
        rightTitle: "#fff",
        accentOpacity: 0.95
      }
    : {
        bg: "#f5faff",
        panelBg:
          "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(250,250,250,0.9) 100%)",
        text: "#1d1d1d",
        sub: "#4c6a77",
        glow: "0 0 0 1px rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.15)",
        rightTitle: "#024",
        accentOpacity: 0.6
      };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        bgcolor: colors.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        transition: "all .3s ease"
      }}
    >
      <Box sx={{ position: "absolute", top: 16, right: 16 }}>
        <ModeToggle size="small" />
      </Box>

      <Paper
        elevation={0}
        sx={{
          position: "relative",
          width: { xs: "92vw", sm: 640, md: 820 },
          minHeight: { xs: 420, sm: 420, md: 440 },
          borderRadius: 2.5,
          p: { xs: 3, sm: 4 },
          overflow: "hidden",
          background: colors.panelBg,
          boxShadow: colors.glow
        }}
      >
        {/* Fondo decorativo */}
        <Box
          aria-hidden
          sx={{
            pointerEvents: "none",
            position: "absolute",
            inset: 0,
            "&::after": {
              content: '""',
              position: "absolute",
              right: -120,
              top: -80,
              bottom: -80,
              width: "70%",
              background:
                "linear-gradient(135deg, #00f0ff 0%, #00c9d6 45%, #00bfa6 100%)",
              opacity: colors.accentOpacity,
              filter: "drop-shadow(0 0 18px rgba(0, 240, 255, 0.35))",
              clipPath: "polygon(26% 0, 100% 0, 100% 100%, 0 100%)",
              borderRadius: 16
            }
          }}
        />

        {/* Layout principal */}
        <Box
          sx={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 3, md: 2 },
            alignItems: "center",
            zIndex: 1,
            minHeight: { md: 360 }
          }}
        >
          {/* Formulario separado */}
          <Box sx={{ px: { md: 2 } }}>
            <LoginForm colors={colors} />
          </Box>

          {/* Panel derecho */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              pr: 1
            }}
          >
            <Typography
              variant="h3"
              sx={{
                color: colors.rightTitle,
                fontWeight: 900,
                letterSpacing: 1,
                mb: 1
              }}
            >
              WELCOME<br />BACK!
            </Typography>
            <Typography sx={{ color: colors.text, opacity: 0.8, maxWidth: 260 }}>
              Lorem ipsum dolor sit amet consectetur adipisicing.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
