import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, CircularProgress } from "@mui/material";

export default function MenuList({ sub, search }) {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sub) return;

    const fetchMenus = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://127.0.0.1:8000/api/menu/"); // 👈 tu endpoint de menús
        const data = await res.json();

        // 🔎 Filtrar por subclasificación y búsqueda
        let filtrados = data.filter(m => m.subclasificacion === sub.name_subclasificacion);

        if (search) {
          filtrados = filtrados.filter(m =>
            m.nombre_menu.toLowerCase().includes(search.toLowerCase())
          );
        }

        setMenus(filtrados);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando menús:", error);
        setLoading(false);
      }
    };

    fetchMenus();
  }, [sub, search]);

  if (!sub) return <Typography>Selecciona una subclasificación</Typography>;
  if (loading) return <CircularProgress />;

  return (
    <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(220px, 1fr))" gap={2} mt={2}>
      {menus.length > 0 ? (
        menus.map((menu) => (
          <Card key={menu.id} sx={{ borderRadius: 3, boxShadow: 3, bgcolor: "#fffefc" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                {menu.nombre_menu}
              </Typography>
              {menu.descripcion && (
                <Typography variant="body2" color="text.secondary">
                  {menu.descripcion}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No hay menús en esta subclasificación</Typography>
      )}
    </Box>
  );
}
