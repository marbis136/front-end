import PrivateRoute from "../shared/PrivateRoute"; // ver abajo
import AppLayout from "../views/layout/MainLayout";      // opcional
import Dashboard from "../views/pages/dashboard";
import ErrorPage  from "../views/ERROR/ErrorPage";
import Usuario from "../views/pages/RRHH/Usuario";

const MainRoutes = {
  path: "/",
  element: (
    <PrivateRoute>
      <AppLayout />
    </PrivateRoute>
  ),
  children: [
    { index: true, element: <Dashboard /> },
    { path: "dashboard", element: <Dashboard /> },
    { path: "usuario", element: <Usuario /> },
    { path: "*", element: <ErrorPage /> }
  ]
};
export default MainRoutes;

