import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate, useRouteError } from "react-router-dom";

/* ======= Ilustración circular con fogata ======= */
function CampfireCircle({ code = "404" }) {
  return (
    <Box
      sx={{
        width: { xs: 260, sm: 320 },
        aspectRatio: "1 / 1",
        borderRadius: "50%",
        overflow: "hidden",
        position: "relative",
        boxShadow: 3,
        background:
          "radial-gradient(110% 100% at 50% 10%, #ffd7b8 0%, #ffb6a1 30%, #8aa0b6 65%, #32475b 100%)"
      }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        {/* Montañas */}
        <path d="M0 65 L20 50 L30 58 L45 42 L60 55 L70 50 L100 65 L100 100 L0 100 Z" fill="#2c3e50" opacity="0.75" />
        <path d="M0 70 L18 58 L28 64 L40 54 L54 66 L66 60 L100 72 L100 100 L0 100 Z" fill="#1f2b38" opacity="0.85" />
        {/* Árboles */}
        {Array.from({ length: 10 }).map((_, i) => {
          const x = 8 + i * 9;
          const h = 6 + ((i * 13) % 5);
          return (
            <g key={i} transform={`translate(${x},70)`} opacity="0.85">
              <rect x="-0.6" y={10 - h} width="1.2" height={h + 6} fill="#1b2732" />
              <polygon points={`0,0 -3,9 3,9`} fill="#1b2732" />
            </g>
          );
        })}
        {/* Código */}
        <text
          x="50"
          y="44"
          textAnchor="middle"
          fontSize="26"
          fontWeight="800"
          fill="white"
          style={{ letterSpacing: 1 }}
        >
          {code}
        </text>
        {/* Fogata */}
        <g transform="translate(50,68)">
          <path d="M0 -8 C4 -5, 4 0, 0 2 C-4 0, -4 -5, 0 -8 Z" fill="#ffb54c" />
          <path d="M0 -6 C3 -4, 3 -1, 0 1 C-3 -1, -3 -4, 0 -6 Z" fill="#ff7f2a" />
          <rect x="-7" y="4" width="14" height="2.2" rx="1" fill="#6b4631" transform="rotate(-12)" />
          <rect x="-7" y="4" width="14" height="2.2" rx="1" fill="#6b4631" transform="rotate(12)" />
        </g>
        <rect x="0" y="74" width="100" height="26" fill="#22303d" />
      </svg>
    </Box>
  );
}

/* ======= Textos por estado ======= */
function getCopy(status) {
  switch (status) {
    case 401:
      return { code: "401", title: "Unauthorized", message: "You aren't authorized to see this page." };
    case 403:
      return { code: "403", title: "Forbidden", message: "Access denied. You don't have permission." };
    case 404:
      return { code: "404", title: "404 ERROR", message: "Sorry, page not found" };
    case 418:
      return { code: "418", title: "I'm a teapot", message: "Contact administrator." };
    case 500:
      return { code: "500", title: "Server error", message: "Something went wrong on our side." };
    case 503:
      return { code: "503", title: "Service unavailable", message: "Looks like our API is down." };
    default:
      return { code: String(status || "Oops"), title: "Unexpected error", message: "Something went wrong." };
  }
}

/* ======= Página de error ======= */
export default function ErrorPage() {
  const routeError = useRouteError();
  const navigate = useNavigate();

  const status = routeError?.status ?? 500;
  const { code, title, message } = getCopy(status);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2
      }}
    >
      <Stack spacing={3} alignItems="center" sx={{ maxWidth: 560, width: "100%" }}>
        <CampfireCircle code={code} />

        <Stack spacing={0.5} alignItems="center">
          <Typography variant="h4" fontWeight={800}>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {message}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={() => navigate("/")}>
            Go back home
          </Button>
          <Button variant="outlined" onClick={() => navigate("/contact")}>
            Contact
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
