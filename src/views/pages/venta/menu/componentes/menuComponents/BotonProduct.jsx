import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

export default function BotonProduct({ product, onClick }) {
  const isDisabled =
    !product.activo ||
    (product.controla_stock && Number(product.stock_actual) <= 0);

  return (
    <Card
      onClick={() => !isDisabled && onClick(product)}
      sx={{
        width: { xs: 80, sm: 100, md: 120, lg: 140 },
        height: { xs: 70, sm: 90, md: 110, lg: 120 },
        backgroundColor: isDisabled ? "#d3d3d3" : "#ff8c69",
        borderRadius: 2,
        boxShadow: "none",
        cursor: isDisabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        opacity: isDisabled ? 0.6 : 1,
        transition: "transform 0.2s ease, background-color 0.3s ease",
        "&:hover": !isDisabled && { transform: "scale(1.05)" },
        animation: `${isDisabled ? "fadeOff" : "fadeOn"} 0.4s ease-in-out`,
        "@keyframes fadeOff": {
          "0%": { backgroundColor: "#ff8c69" },
          "50%": { backgroundColor: "#e0e0e0" },
          "100%": { backgroundColor: "#d3d3d3" },
        },
        "@keyframes fadeOn": {
          "0%": { backgroundColor: "#d3d3d3" },
          "50%": { backgroundColor: "#ffa07a" },
          "100%": { backgroundColor: "#ff8c69" },
        },
      }}
      title={
        !product.activo
          ? "Producto deshabilitado"
          : product.controla_stock && Number(product.stock_actual) <= 0
          ? "Sin stock"
          : "Disponible"
      }
    >
      <CardContent
        sx={{
          p: 0.5,
          textAlign: "center",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          fontWeight="bold"
          align="center"
          sx={{
            fontSize: { xs: "0.85rem", sm: "1rem", md: "1.1rem" },
            color: "#000",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {product.code}
        </Typography>

        {product.controla_stock && (
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.75rem",
              color: isDisabled ? "text.disabled" : "#000",
              mt: 0.5,
            }}
          >
            {Number(product.stock_actual) > 0
              ? `Stock: ${product.stock_actual}`
              : "❌ Sin stock"}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
