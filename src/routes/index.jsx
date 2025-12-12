import { createBrowserRouter } from "react-router-dom";
import AuthenticationRoutes from "./AuthenticationRoutes";
import MainRoutes from "./MainRoutes";
import GestionVentas from "./GestionVentas";
import rrhh from "./RecusrsosHumanos";
import PedidosRoutes from "./PedidosRoutes";

const router = createBrowserRouter(
  [MainRoutes, AuthenticationRoutes, GestionVentas, rrhh, PedidosRoutes],
);

export default router;
