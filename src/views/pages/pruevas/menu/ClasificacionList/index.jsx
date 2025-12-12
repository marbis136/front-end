import React, { useEffect, useState } from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, CircularProgress } from '@mui/material';
import { LocalPizza, LocalBar, Cake, EmojiNature, Category as DefaultIcon } from '@mui/icons-material';

// Mapeo de íconos según categoría
const categoryIcons = {
  Pizzas: <LocalPizza />,
  Bebidas: <LocalBar />,
  Postres: <Cake />,
  Ensaladas: <EmojiNature />
};

export default function ClasificacionList({ onSelect }) {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/menuclasificaciones/');
        const data = await res.json();
        setCategories(data);
        setActiveCategory(data[0]?.name_clasificacion || null);
        if (onSelect) onSelect(data[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error cargando clasificaciones:', error);
        setLoading(false);
      }
    };
    fetchCategories();
  }, [onSelect]);

  if (loading) return <CircularProgress />;

  return (
    <Box width={200} bgcolor="#fff" p={2} borderRadius={2} boxShadow={1}>
      <List>
        {categories.map((cat) => {
          const isActive = activeCategory === cat.name_clasificacion;
          return (
            <ListItemButton
              key={cat.id}
              selected={isActive}
              onClick={() => {
                setActiveCategory(cat.name_clasificacion);
                if (onSelect) onSelect(cat);
              }}
              sx={{
                borderRadius: 2,
                mb: 1,
                bgcolor: isActive ? '#E3F2FD' : 'transparent',
                '&.Mui-selected': {
                  bgcolor: '#BBDEFB',
                  fontWeight: 'bold'
                }
              }}
            >
              <ListItemIcon sx={{ color: isActive ? '#1976d2' : '#757575' }}>
                {categoryIcons[cat.name_clasificacion] || <DefaultIcon />}
              </ListItemIcon>
              <ListItemText
                primary={cat.name_clasificacion}
                primaryTypographyProps={{
                  fontWeight: isActive ? 'bold' : 'normal',
                  color: isActive ? 'primary' : 'text.secondary'
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}
