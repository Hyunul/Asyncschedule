// src/router.tsx (예시)
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Schedule from "../pages/Schedule";
import Chart from "../pages/Chart";
import Join from "../pages/Join";
import ProtectedRoute from "../components/ProtectRouter";
import Profile from "../pages/Profile";

export const router = createBrowserRouter([
  {
    element: <AppLayout />, // 모든 페이지 공통 레이아웃
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/SignUp", element: <SignUp /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/schedule", element: <Schedule /> },
      { path: "/stats", element: <Chart /> },
      { path: "/joinGroup", element: <Join /> },
      { path: "/profile", element: <Profile /> },
    ],
  },
]);
