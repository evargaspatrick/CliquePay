import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import HomePage from "../pages/homepage";
import SignupPage from "../pages/signup";
import Verify from "../pages/verify";
import Login from "../pages/login";
import Dashboard from "../pages/dashboard";
import UserProfile from "../pages/userprofile";
import EditProfile from "../pages/editprofile"
// import FriendsList from "../pages/friendslist"
import Friends from "../pages/friends";
import ForgotPassword from "../pages/forgot";
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "verify", element: <Verify /> },
      { path: "login", element: <Login /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "profile", element: <UserProfile /> },
      { path: "friends-list", element: <Friends /> },
      { path: "profile/edit", element: <EditProfile /> },
      { path: "friends", element: <Friends /> },
      { path: "forgot", element: <ForgotPassword/>},
    ]
  }
]);

export default router;