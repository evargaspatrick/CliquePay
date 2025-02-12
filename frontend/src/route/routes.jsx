import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/homepage";

const router = createBrowserRouter([
  {
    path: "/",       // Change to root path
    element: <HomePage />
  }
]);

export default router;