// routes/PedidosRoutes.jsx
import PrivateRoute from "../shared/PrivateRoute";
import PedidosLayout from "../views/layout/pedidos/PedidosLayout";
import LoginPedidos from "../views/pages/recepcion pedidos/login/index";
import DashboardPedidos from "../views/pages/recepcion pedidos/dashboardPedidos";

const PedidosRoutes = {
  path: "/pedidos",
  children: [
    // Login de pedidos (público)
    { path: "login", element: <LoginPedidos /> },

    // Dashboard protegido
    {
      path: "dashboard",
      element: (
        <PrivateRoute>
          <PedidosLayout />
        </PrivateRoute>
      ),
      children: [
        { index: true, element: <DashboardPedidos /> },
      ],
    },
  ],
};

export default PedidosRoutes;
