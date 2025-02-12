import { createBrowserRouter } from "react-router-dom";
// import SignupPage from "../pages/signup1";
import HomePage from "../pages/homepage";

const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <SignupPage />  // This will now load first
  // },
  {
    path: "/home",
    element: <HomePage />    // HomePage moved to /home route
  }
]);

export default router;