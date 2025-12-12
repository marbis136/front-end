import { useState } from "react";
import {
  Box, Tabs, Tab, Stack, Typography, Divider, Paper, useTheme
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PaymentIcon from "@mui/icons-material/Payment";
import DetalleVentas from "./DetalleVentas";
import DetalleAbonos from "./DetalleAbonos";
import { motion, AnimatePresence } from "framer-motion";

export default function VentasIndex() {
  const [tab, setTab] = useState(0);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box p={2}>
      {/* ================= HEADER ================= */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: isDark
            ? "linear-gradient(135deg, #1c1c1c 0%, #222 100%)"
            : "linear-gradient(135deg, #f9fafc 0%, #ffffff 100%)",
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography
              variant="h5"
              fontWeight={700}
              color={isDark ? "primary.light" : "primary.main"}
            >
              🧾 Panel de Ventas
            </Typography>
            <Typography
              variant="body2"
              color={isDark ? "grey.400" : "text.secondary"}
            >
              Consulta, gestiona y revisa tus operaciones del día
            </Typography>
          </Box>
        </Stack>

        {/* ================= TABS ================= */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            mt: 3,
            "& .MuiTab-root": {
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 2,
              mx: 0.5,
              minHeight: 48,
            },
            "& .Mui-selected": {
              backgroundColor: isDark ? "#2a2a2a" : "#eef6ff",
            },
          }}
        >
          <Tab
            icon={<ReceiptLongIcon fontSize="medium" />}
            iconPosition="start"
            label="Ventas Realizadas"
          />
          <Tab
            icon={<PaymentIcon fontSize="medium" />}
            iconPosition="start"
            label="Pagos / Abonos"
          />
        </Tabs>
      </Paper>

      <Divider sx={{ mb: 3, opacity: 0.3 }} />

      {/* ================= CONTENIDO DINÁMICO ================= */}
      <AnimatePresence mode="wait">
        {tab === 0 && (
          <motion.div
            key="ventas"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <DetalleVentas />
          </motion.div>
        )}
        {tab === 1 && (
          <motion.div
            key="abonos"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <DetalleAbonos />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
