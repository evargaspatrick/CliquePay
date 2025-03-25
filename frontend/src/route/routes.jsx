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
      { path: "profile/edit", element: <EditProfile /> }
      // { path: "friends-list", element: <FriendsList /> }
    ]
  }
]);

export default router;