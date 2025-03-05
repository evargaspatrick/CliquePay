import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import HomePage from "../pages/homepage";
import SignupPage from "../pages/signup1";
import Verify from "../pages/verify";
import Login from "../pages/login";
import Dashboard from "../pages/dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "verify", element: <Verify /> },
      { path: "login", element: <Login /> },
      { path: "dashboard", element: <Dashboard /> }
    ]
  }
]);

export default router;