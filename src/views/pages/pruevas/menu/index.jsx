import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import ClasificacionList from "./ClasificacionList";
import SubclasificacionFilter from "./SubclasificacionFilter";
import MenuList from "./MenuList";

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filter, setFilter] = useState({ sub: null, search: "" });

  return (
    <Box display="flex" gap={3} p={3}>
      {/* Clasificaciones en vertical */}
      <ClasificacionList onSelect={setSelectedCategory} />

      {/* Contenido */}
      <Box flex={1}>
        {selectedCategory ? (
          <>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              {selectedCategory.name_clasificacion}
            </Typography>

            {/* Subclasificaciones + buscador */}
            <SubclasificacionFilter
              categoria={selectedCategory}
              onFilter={setFilter}
            />

            {/* 🔥 Menús de esa subclasificación */}
            <MenuList sub={filter.sub} search={filter.search} />
          </>
        ) : (
          <Typography>Selecciona una clasificación</Typography>
        )}
      </Box>
    </Box>
  );
}
