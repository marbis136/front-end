import PrivateRoute from "../shared/PrivateRoute"; // ver abajo
import AppLayout from "../views/layout/MainLayout";      // opcional
import Dashboard from "../views/pages/dashboard";
import ErrorPage  from "../views/ERROR/ErrorPage";
import Personal from "../views/pages/RRHH/Personal";
import Aguinaldo from "../views/pages/RRHH/Aguinaldo";
import Asistencia from "../views/pages/RRHH/Asistencia";
import Finiquito from "../views/pages/RRHH/Finiquito";
import Contrato from "../views/pages/RRHH/Contrato"
import Horario from "../views/pages/RRHH/Horario"
import Prueva from "../views/pages/pruevas";


const RecusrsosHumanos = {
  path: "/",
  element: (
    <PrivateRoute>
      <AppLayout />
    </PrivateRoute>
  ),
  children: [
    { index: true, element: <Dashboard /> },
    { path: "dashboard", element: <Dashboard /> },
    { path: "personal", element: <Personal /> },
    { path: "aguinaldo", element: <Aguinaldo /> },
    { path: "asistencia", element: <Asistencia /> },
    { path: "finiquito", element: <Finiquito /> },
    { path: "contrato", element: <Contrato /> },
    { path: "horarios", element: <Horario /> },
    { path: "prueva", element: <Prueva /> },
    { path: "*", element: <ErrorPage /> }
  ]
};
export default RecusrsosHumanos;

