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
    element: <AppLayout />, // 공통 레이아웃 (Header, Footer 포함)
    children: [
      // 1. 누구나 접근 가능한 페이지
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/SignUp", element: <SignUp /> },
      { path: "/joinGroup", element: <Join /> },

      // 2. 로그인이 필요한 페이지 (ProtectedRoute로 감싸기)
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/schedule", element: <Schedule /> },
          { path: "/stats", element: <Chart /> },
          { path: "/profile", element: <Profile /> },
        ],
      },
    ],
  },
]);