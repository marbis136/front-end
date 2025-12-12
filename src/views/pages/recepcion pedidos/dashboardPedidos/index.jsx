import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Button,
  Badge,
  Paper,
} from "@mui/material";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { motion } from "framer-motion";
import { useAuth } from "../../../../auth/AuthContext";
import api from "../../../../api/axios";

import PedidosView from "./PedidosView";
import ListosView from "./ListosView";
import IngredientesView from "./IngredientesView";
import MenuView from "./MenuView";

export default function DashboardPedidos() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("pedidos");

  // Estados globales compartidos
  const [pedidosCount, setPedidosCount] = useState(0);
  const [listos, setListos] = useState([]);
  const [listosCount, setListosCount] = useState(0);

  // 🔁 Actualiza contadores en tiempo real (solo números, no data completa)
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const pedidos = await api.get("/venta/pedidos/");
        const listosRes = await api.get("/venta/listos/");
        setPedidosCount(pedidos.data.length);
        setListosCount(listosRes.data.length);
      } catch (err) {
        console.error("Error al cargar contadores:", err);
      }
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 10000);
    return () => clearInterval(interval);
  }, []);

  const items = [
    {
      key: "pedidos",
      label: "Pendientes",
      icon: <ListAltRoundedIcon />,
      count: pedidosCount,
    },
    {
      key: "listos",
      label: "Listos",
      icon: <DoneAllRoundedIcon />,
      count: listosCount,
    },
    {
      key: "ingredientes",
      label: "Ingredientes",
      icon: <Inventory2RoundedIcon />,
    },
    {
      key: "menu",
      label: "Menú",
      icon: <RestaurantMenuRoundedIcon />,
    },
  ];

  return (
    <Box sx={{ bgcolor: "#f5f6fa", minHeight: "100vh", overflow: "hidden" }}>
      {/* 🔻 Barra superior */}
      <Paper
        elevation={6}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 1.5,
          borderRadius: "0 0 20px 20px",
          background: "linear-gradient(90deg, #c62828 0%, #b71c1c 100%)",
          color: "#fff",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        {/* 🔘 Botones de tabs */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          {items.map((item) => (
            <Badge
              key={item.key}
              badgeContent={item.count ?? 0}
              color="secondary"
              invisible={!item.count}
            >
              <Button
                onClick={() => setTab(item.key)}
                startIcon={item.icon}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  color: tab === item.key ? "#b71c1c" : "#fff",
                  backgroundColor: tab === item.key ? "#fff" : "transparent",
                  borderRadius: "10px",
                  px: 2.5,
                  py: 0.9,
                  transition: "all 0.25s ease",
                  "&:hover": {
                    backgroundColor:
                      tab === item.key ? "#fff" : "rgba(255,255,255,0.25)",
                  },
                }}
              >
                {item.label}
              </Button>
            </Badge>
          ))}
        </Stack>

        {/* 🔐 Usuario y logout */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body1" fontWeight="bold">
            SUCURSAL:{" "}
            <Typography
              component="span"
              sx={{ color: "#fff", fontWeight: "bold" }}
            >
              {user?.almacen || "SIN ASIGNAR"}
            </Typography>
          </Typography>

          <IconButton
            size="small"
            onClick={logout}
            sx={{
              color: "#fff",
              bgcolor: "rgba(255,255,255,0.2)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.35)" },
              borderRadius: "50%",
            }}
          >
            <LogoutRoundedIcon />
          </IconButton>
        </Stack>
      </Paper>

      {/* 🔄 Vista principal */}
      <Box p={3} sx={{ overflowY: "auto", height: "calc(100vh - 80px)" }}>
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {tab === "pedidos" && <PedidosView setListos={setListos} />}
          {tab === "listos" && <ListosView listos={listos} setListos={setListos} />}
          {tab === "ingredientes" && <IngredientesView />}
          {tab === "menu" && <MenuView />}
        </motion.div>
      </Box>
    </Box>
  );
}
