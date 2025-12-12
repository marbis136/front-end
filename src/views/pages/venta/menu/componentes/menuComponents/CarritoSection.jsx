import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useState, useMemo } from "react";
import ModalVenta from "../ventaDetalleComponents/ModalVenta";

export default function CarritoSection({
  items,
  products,
  updateItem,
  eliminarItem,
  limpiarCarrito,
}) {
  const [modalVenta, setModalVenta] = useState(false);

  // 🧮 Calcular precio correcto según tipo
  const obtenerPrecioUnitario = (item) => {
    const p1 = products.find((p) => p.code === String(item.prod1))?.price || 0;
    const p2 =
      item.tipo === "mitad"
        ? products.find((p) => p.code === String(item.prod2))?.price || 0
        : 0;
    return item.tipo === "mitad" ? Math.max(p1, p2) : p1;
  };

  // 🧮 Calcular subtotal y total dinámicamente
  const { subtotal, totalPagar } = useMemo(() => {
    const sub = items.reduce((acc, item) => {
      const precio = obtenerPrecioUnitario(item);
      return acc + precio * item.cantidad;
    }, 0);
    return { subtotal: sub, totalPagar: sub };
  }, [items, products]);

  // 🧮 Calcular precio según tipo
  const obtenerPrecio = (item) => {
    if (item.tipo === "mitad") {
      const p1 = products.find((p) => p.code === String(item.prod1))?.price || 0;
      const p2 = products.find((p) => p.code === String(item.prod2))?.price || 0;
      return Math.max(p1, p2);
    }
    return products.find((p) => p.code === String(item.prod1))?.price || 0;
  };

  return (
    <Box width={460} p={1.5} height="100vh" display="flex" flexDirection="column">
      {/* Tabla */}
      <Paper
        elevation={4}
        sx={{
          p: 2,
          borderRadius: 2,
          flex: 1,
          maxHeight: "60vh",
          overflow: "auto",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          sx={{ color: (theme) => theme.palette.primary.main }}
        >
          Pedido
        </Typography>
        <Divider sx={{ mb: 1 }} />

        <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.palette.grey[900]
                    : theme.palette.grey[100],
              }}
            >
              <TableCell align="center" sx={{ fontSize: "0.75rem", width: 50 }}>
                Cant
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "0.75rem", width: 90 }}>
                Tipo
              </TableCell>
              <TableCell sx={{ fontSize: "0.75rem", width: 100 }}>
                Descripción
              </TableCell>
              <TableCell align="right" sx={{ fontSize: "0.75rem", width: 50 }}>
                Precio
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "0.75rem", width: 50 }}>
                Eliminar
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{ fontSize: "0.85rem", py: 3, color: "gray" }}
                >
                  Carrito vacío
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, i) => {
                const baseProd = products.find((p) => p.code === item.prod1);
                const categoria = baseProd?.category || "";
                const isPizza = categoria === "PIZZAS";
                const isPersonal = baseProd?.subcategory === "PERSONAL";
                const isBebida = categoria === "BEBIDAS";
                const isExtra = categoria === "EXTRAS";

                // 🧩 Asegurar tipo por defecto
                // 🧩 Asegurar tipo por defecto solo una vez
                if (isBebida && (!item.tipo || item.tipo === "entera")) {
                  // 🔥 fuerza el tipo correcto en bebidas
                  updateItem(i, "tipo", "natural");
                }
                if (isPizza && (!item.tipo || item.tipo === "natural")) {
                  // 🔥 fuerza el tipo correcto en pizzas
                  updateItem(i, "tipo", "entera");
                }


                // 🧾 Descripción limpia
                let descripcion = baseProd?.code || `#${item.prod1}`;
                if (isPizza && item.tipo === "mitad") {
                  const segunda =
                    products.find((p) => p.code === item.prod2)?.code || "??";
                  descripcion = `${baseProd.code}/${segunda}`;
                } else if (isBebida) {
                  descripcion = `${baseProd.code} (${item.tipo || "natural"})`;
                } else if (isExtra) {
                  descripcion = `Extra ${baseProd.code} `;
                }

                const precio = obtenerPrecioUnitario(item) * item.cantidad;

                return (
                  <TableRow key={i} hover>
                    {/* Cantidad */}
                    <TableCell align="center">
                      <TextField
                        size="small"
                        value={item.cantidad}
                        onChange={(e) =>
                          updateItem(i, "cantidad", parseInt(e.target.value) || 1)
                        }
                        sx={{
                          width: 50,
                          "& .MuiInputBase-input": {
                            fontSize: "0.75rem",
                            textAlign: "center",
                          },
                        }}
                      />
                    </TableCell>

                    {/* Tipo */}
                    <TableCell align="center">
                      <Box
                        display="flex"
                        flexDirection="column"
                        gap={0.5}
                        alignItems="center"
                      >
                        {/* --- PIZZAS --- */}
                        {isPizza && (
                          <>
                            <Select
                              size="small"
                              value={item.tipo || "entera"}
                              onChange={(e) => {
                                const tipo = e.target.value;
                                updateItem(i, "tipo", tipo);

                                if (tipo === "mitad" && !isPersonal) {
                                  const compatibles = products.filter((p) => {
                                    const sub1 = (p.subcategory || "")
                                      .trim()
                                      .toUpperCase();
                                    const sub2 = (baseProd.subcategory || "")
                                      .trim()
                                      .toUpperCase();
                                    return (
                                      p.category === "PIZZAS" &&
                                      sub1 === sub2 &&
                                      p.code !== baseProd.code
                                    );
                                  });
                                  if (compatibles.length > 0) {
                                    updateItem(i, "prod2", compatibles[0].code);
                                  }
                                } else {
                                  updateItem(i, "prod2", null);
                                }
                              }}
                              disabled={isPersonal}
                              sx={{
                                "& .MuiSelect-select": {
                                  fontSize: "0.7rem",
                                  py: 0.3,
                                },
                                width: 90,
                              }}
                            >
                              <MenuItem value="entera">entera</MenuItem>
                              {!isPersonal && (
                                <MenuItem value="mitad">mitad</MenuItem>
                              )}
                            </Select>

                            {item.tipo === "mitad" && !isPersonal && (
                              <Select
                                size="small"
                                value={item.prod2 || ""}
                                onChange={(e) =>
                                  updateItem(i, "prod2", e.target.value)
                                }
                                sx={{
                                  "& .MuiSelect-select": {
                                    fontSize: "0.65rem",
                                    py: 0.3,
                                  },
                                  width: 90,
                                }}
                              >
                                {products
                                  .filter((p) => {
                                    const sub1 = (p.subcategory || "")
                                      .trim()
                                      .toUpperCase();
                                    const sub2 = (baseProd.subcategory || "")
                                      .trim()
                                      .toUpperCase();
                                    return (
                                      p.category === "PIZZAS" &&
                                      p.size === baseProd.size &&
                                      sub1 === sub2 &&
                                      p.code !== baseProd.code
                                    );
                                  })
                                  .map((p) => (
                                    <MenuItem key={p.code} value={p.code}>
                                      {p.name}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          </>
                        )}

                        {/* --- BEBIDAS --- */}
                        {isBebida && (
                          <Select
                            size="small"
                            value={item.tipo || "natural"} // ✅ natural por defecto
                            onChange={(e) => updateItem(i, "tipo", e.target.value)}
                            sx={{
                              "& .MuiSelect-select": { fontSize: "0.7rem", py: 0.3 },
                              width: 90,
                            }}
                          >
                            <MenuItem value="natural">natural</MenuItem>
                            <MenuItem value="fría">fría</MenuItem>
                          </Select>
                        )}

                        {/* --- EXTRAS --- */}
                        {isExtra && (
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "0.75rem",
                              color: "text.secondary",
                            }}
                          >
                            extra
                          </Typography>
                        )}
                      </Box>
                    </TableCell>

                    {/* Descripción */}
                    <TableCell sx={{ maxWidth: 100 }}>
                      <Typography sx={{ fontSize: "0.9rem" }} noWrap>
                        {descripcion}
                      </Typography>
                    </TableCell>

                    {/* Precio */}
                    <TableCell align="right" sx={{ fontSize: "0.75rem" }}>
                      Bs.{precio.toFixed(2)}
                    </TableCell>

                    {/* Eliminar */}
                    <TableCell align="center" sx={{ width: 40 }}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => eliminarItem(i)}
                        sx={{ p: 0.3 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Resumen */}
      <Paper elevation={4} sx={{ p: 2, borderRadius: 2, mt: 0.5 }}>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body2" color="text.secondary">
            Subtotal
          </Typography>
          <Typography variant="body2">Bs.{subtotal.toFixed(2)}</Typography>
        </Box>
        <Divider sx={{ my: 1 }} />

        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="subtitle1" fontWeight="bold">
            Total
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold" color="primary">
            Bs.{Math.round(totalPagar)}
          </Typography>
        </Box>

        <Box display="flex" gap={1}>
          <Button fullWidth variant="outlined" color="error" onClick={limpiarCarrito}>
            Cancelar
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="success"
            onClick={() => setModalVenta(true)}
          >
            Vender
          </Button>
        </Box>
      </Paper>

      <ModalVenta
        open={modalVenta}
        onClose={() => setModalVenta(false)}
        total={Math.round(totalPagar)}
        items={items.map((item) => {
          const baseProd = products.find((p) => p.code === item.prod1);
          const categoria = baseProd?.category || "";
          const isPizza = categoria === "PIZZAS";
          const isBebida = categoria === "BEBIDAS";
          const isExtra = categoria === "EXTRAS";

          let descripcion = baseProd?.code || `#${item.prod1}`;
          if (isPizza && item.tipo === "mitad") {
            const segunda = products.find((p) => p.code === item.prod2)?.code || "??";
            descripcion = `${baseProd.code}/${segunda}`;
          } else if (isBebida) {
            descripcion = `${baseProd.code} (${item.tipo || "natural"})`;
          } else if (isExtra) {
            descripcion = `Extra ${baseProd.code}`;
          }

          return {
            ...item,
            descripcion,
            price: obtenerPrecio(item),
          };
        })}
        onConfirm={(data) => {
          console.log("Venta confirmada:", data);

          // 🧹 Limpia el carrito completamente
          limpiarCarrito();

          // ❌ Cierra el modal
          setModalVenta(false);
        }}
      />


    </Box>
  );
}
