import { useEffect, useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import {
  LocalPizza, LocalBar, Cake, EmojiNature, LunchDining, Restaurant,
  Category as DefaultIcon
} from "@mui/icons-material";
import api from "../../../../../../api/axios"; // 👈 tu Axios con token

const categoryIcons = {
  Pizzas: <LocalPizza />,
  Bebidas: <LocalBar />,
  Postres: <Cake />,
  Ensaladas: <EmojiNature />,
  Hamburguesas: <LunchDining />,
  Combos: <Restaurant />
};

export default function SidebarCategorias({ activeCategory, setActiveCategory }) {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    api.get("/menuclasificacion/") // 👈 tu endpoint real
      .then((res) => {
        setCategorias(res.data); // 👉 guardamos objetos completos
      })
      .catch((err) => {
        console.error("Error cargando clasificaciones:", err);
      });
  }, []);

  return (
    <Box
      width={240}
      height="100vh"
      p={2}
      sx={(theme) => ({
        bgcolor: theme.palette.mode === "dark"
          ? theme.palette.grey[900]
          : theme.palette.grey[100],
        borderRight: `1px solid ${
          theme.palette.mode === "dark"
            ? theme.palette.divider
            : theme.palette.grey[300]
        }`
      })}
    >
      <Typography variant="h6" fontWeight="bold" mb={2} color="text.primary">
        Clasificaciones
      </Typography>

      <Paper
        elevation={2}
        sx={(theme) => ({
          p: 1.5,
          borderRadius: 3,
          bgcolor: theme.palette.mode === "dark"
            ? theme.palette.background.paper
            : theme.palette.background.default,
        })}
      >
        {categorias.map((cat) => {
          const isActive = cat.name_clasificacion === activeCategory;
          const icon = categoryIcons[cat.name_clasificacion] || <DefaultIcon />;
          return (
            <Button
              key={cat.id}
              fullWidth
              startIcon={icon}
              onClick={() => setActiveCategory(cat.name_clasificacion)}
              sx={(theme) => ({
                justifyContent: "flex-start",
                textTransform: "none",
                mb: 1,
                py: 1.2,
                borderRadius: 2,
                fontWeight: isActive ? "bold" : 500,
                bgcolor: isActive
                  ? theme.palette.mode === "dark"
                    ? theme.palette.primary.dark
                    : theme.palette.primary.light
                  : "transparent",
                color: isActive
                  ? theme.palette.primary.contrastText
                  : theme.palette.text.primary,
                "&:hover": {
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText
                }
              })}
            >
              {cat.name_clasificacion}
            </Button>
          );
        })}
      </Paper>
    </Box>
  );
}
