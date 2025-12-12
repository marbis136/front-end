// routes/gestionVentas.jsx
import { Navigate } from "react-router-dom";
import PrivateRoute from "../shared/PrivateRoute"; // ver abajo
import AppLayout from "../views/layout/MainLayout"; // opcional

import Dashboard from "../views/pages/dashboard";
import Ventas from "../views/pages/venta/ventas";
import Caja from "../views/pages/venta/caja";
import Gastos from "../views/pages/venta/gastos";
import Pedidos from "../views/pages/venta/pedidos";
import Menu from "../views/pages/venta/menu";
import Usuario from "../views/pages/RRHH/Usuario";

const GestionVentas = {
  path: "/",
  element: (
    <PrivateRoute>
      <AppLayout />
    </PrivateRoute>
  ),
  children: [
    // Home → Dashboard
    { index: true, element: <Dashboard /> },

    // Módulo Ventas
    { path: "ventas", element: <Ventas /> },
    { path: "caja", element: <Caja /> },
    { path: "gastos", element: <Gastos /> },
    { path: "pedidos", element: <Pedidos /> },
    {path: "usuario", element: <Usuario />},
    // Menú / Productos
    { path: "menu", element: <Menu /> },

    // 404: cualquier ruta desconocida vuelve al dashboard
    { path: "*", element: <Navigate to="/" replace /> },
  ],
};

export default GestionVentas;
