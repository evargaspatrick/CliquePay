import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import HomePage from "../pages/homepage";
import SignupPage from "../pages/signup";
import Verify from "../pages/verify";
import Login from "../pages/login";
import Dashboard from "../pages/dashboard";
import UserProfile from "../pages/userprofile";
import EditProfile from "../pages/editprofile"
import Friends from "../pages/friends";
import ForgotPassword from "../pages/forgot";
import { ErrorDisplay } from '../components/errorHandling/ErrorBoundary';
import NotFound from '../pages/not-found';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorDisplay />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "verify", element: <Verify /> },
      { path: "login", element: <Login /> },
      { path: "dashboard", element: <Dashboard />, errorElement: <ErrorDisplay /> },
      { path: "profile", element: <UserProfile /> },
      { path: "friends-list", element: <Friends /> },
      { path: "profile/edit", element: <EditProfile /> },
      { path: "friends", element: <Friends />, errorElement: <ErrorDisplay /> },
      { path: "forgot", element: <ForgotPassword/>},
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

export default router;