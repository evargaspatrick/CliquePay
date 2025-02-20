import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/homepage";
import SignupPage from "../pages/signup1";
import Verify from "../pages/verify";
import Login from "../pages/login";
import Dashboard from "../pages/dashboard"; // Add this import

const router = createBrowserRouter([
  {
    path: "/",    
    element: <HomePage />
  },
  {
    path:"/signup",
    element: <SignupPage/>
  },
  {
    path:"/verify",
    element: <Verify/>
  },
  {
    path:"/login",
    element: <Login/>
  },
  {
    path:"/dashboard", // Add the dashboard route
    element: <Dashboard/>
  }
]);

export default router;