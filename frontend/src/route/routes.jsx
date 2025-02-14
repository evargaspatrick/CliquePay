import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/homepage";
import SignupPage from "../pages/signup1";

const router = createBrowserRouter([
  {
    path: "/",    
    element: <HomePage />
  },
  {
    path:"/signup",
    element: < SignupPage/>
  }
  
]);

export default router;