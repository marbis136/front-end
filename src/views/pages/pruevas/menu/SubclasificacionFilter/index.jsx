import React, { useEffect, useState } from "react";
import { Box, Button, TextField, InputAdornment, CircularProgress } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

export default function SubclasificacionFilter({ categoria, onFilter }) {
  const [subcategorias, setSubcategorias] = useState([]);
  const [activeSub, setActiveSub] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!categoria) return;

    const fetchSubclasificaciones = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://127.0.0.1:8000/api/menusubclasificaciones/");
        const data = await res.json();

        // Filtrar por la categoría activa
        const filtradas = data.filter(s => s.clasificacion === categoria.name_clasificacion);
        setSubcategorias(filtradas);
        setActiveSub(filtradas[0] || null);
        if (onFilter) onFilter({ sub: filtradas[0], search: "" });
        setLoading(false);
      } catch (error) {
        console.error("Error cargando subclasificaciones:", error);
        setLoading(false);
      }
    };

    fetchSubclasificaciones();
  }, [categoria, onFilter]);

  // Manejar cambios
  const handleSelectSub = (sub) => {
    setActiveSub(sub);
    if (onFilter) onFilter({ sub, search: searchTerm });
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onFilter) onFilter({ sub: activeSub, search: value });
  };

  if (!categoria) return null;
  if (loading) return <CircularProgress />;

  return (
    <Box display="flex" gap={1} flexWrap="wrap" alignItems="center" mb={2}>
      {subcategorias.map((sub) => (
        <Button
          key={sub.id}
          variant={activeSub?.id === sub.id ? "contained" : "outlined"}
          onClick={() => handleSelectSub(sub)}
          sx={{
            backgroundColor: activeSub?.id === sub.id ? "#FFCC80" : "#fff",
            color: activeSub?.id === sub.id ? "#000" : "#4B5563",
            borderColor: "#FFCC80",
            fontWeight: activeSub?.id === sub.id ? "bold" : 500,
            borderRadius: 3,
            textTransform: "none",
            px: 2
          }}
        >
          {sub.name_subclasificacion}
        </Button>
      ))}

      {/* Buscador */}
      <TextField
        size="small"
        placeholder="Buscar por nombre o código"
        value={searchTerm}
        onChange={handleSearch}
        sx={{ minWidth: 250 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          )
        }}
      />
    </Box>
  );
}
