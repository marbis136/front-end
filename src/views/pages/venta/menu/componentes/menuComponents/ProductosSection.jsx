import { Box, Button, Grid, TextField, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import ProductoCard from "./BotonProduct";

export default function ProductosSection({
  activeCategory,
  activeSub,
  setActiveSub,
  searchTerm,
  setSearchTerm,
  subcategoriasPorCategoria,
  productosFiltrados,
  handleAddToCart,
  searchInputRef,
}) {
  return (
    <Box flex={1} p={2} display="flex" flexDirection="column">
      {/* 🟡 Barra de filtros y búsqueda */}
      <Box
        display="flex"
        gap={2}
        mb={2}
        justifyContent="space-between"
        flexWrap="wrap"
      >
        {/* Subcategorías */}
        <Box display="flex" gap={1} flexWrap="wrap">
          {subcategoriasPorCategoria[activeCategory]?.map((sub, index) => (
            <Button
              key={index}
              variant={sub === activeSub ? "contained" : "outlined"}
              onClick={() => setActiveSub(sub)}
              sx={{
                backgroundColor: sub === activeSub ? "#FFCC80" : "#fff",
                color: sub === activeSub ? "#000" : "#4B5563",
                borderColor: "#FFCC80",
                fontWeight: 500,
                borderRadius: 8,
                textTransform: "none",
                px: 2,
                "&:hover": { backgroundColor: "#FFE0B2" },
              }}
            >
              {sub}
            </Button>
          ))}
        </Box>

        {/* Buscador */}
        <TextField
          inputRef={searchInputRef}
          size="small"
          placeholder="Buscar por nombre o código"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* 🧩 Contenedor con scroll SOLO para productos */}
      <Box
        flex={1}
        sx={(theme) => ({
          overflowY: "auto",
          maxHeight: "70vh",
          pr: 1,
          /* 🎨 Scrollbar personalizado dependiente del tema */
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.grey[900]
                : theme.palette.grey[200],
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.primary.dark
                : theme.palette.primary.main,
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.primary.light
                : theme.palette.primary.dark,
          },
        })}
      >
        <Grid container spacing={2}>
          {/* Si no hay productos */}
          {productosFiltrados.length === 0 ? (
            <Grid item xs={12}>
              <p>No hay productos disponibles en esta categoría</p>
            </Grid>
          ) : (
            // 🔢 Orden natural: 1, 2, 3, 10, 11, 12...
            [...productosFiltrados]
              .sort((a, b) => {
                const codeA = String(a.code);
                const codeB = String(b.code);

                // Extraer parte numérica de los códigos
                const numA = parseInt(codeA.match(/\d+/)?.[0] || "0", 10);
                const numB = parseInt(codeB.match(/\d+/)?.[0] || "0", 10);

                // Si ambos tienen números, ordenar por número
                if (numA !== numB) return numA - numB;

                // Si son iguales o no tienen número, ordenar alfabéticamente
                return codeA.localeCompare(codeB, undefined, { numeric: true });
              })
              .map((product) => {
                const disabled =
                  !product.activo ||
                  (product.controla_stock &&
                    Number(product.stock_actual) <= 0);

                return (
                  <Grid item xs={6} md={3} key={product.id}>
                    <ProductoCard
                      product={product}
                      onClick={() => !disabled && handleAddToCart(product)}
                      disabled={disabled}
                    />
                  </Grid>
                );
              })
          )}
        </Grid>
      </Box>
    </Box>
  );
}