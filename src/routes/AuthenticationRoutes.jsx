import Login from "../views/pages/Login"; // tu formulario

const AuthenticationRoutes = {
  path: "/",
  children: [
    { path: "login", element: <Login /> },
  ],
};

export default AuthenticationRoutes;
