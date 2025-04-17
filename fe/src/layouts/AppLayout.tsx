// src/layouts/AppLayout.tsx
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AppLayout() {
  return (
    <Box
      sx={{
        minHeight: "100vh",     // 화면 전체 높이
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />

      {/* 페이지별 컨텐츠 영역 */}
      <Box component="main" sx={{ flexGrow: 1, px: 2 }}>
        <Outlet />              {/* 현재 라우트의 화면이 여기 들어감 */}
      </Box>

      <Footer />               {/* column 맨 아래 → “스티키” 푸터 */}
    </Box>
  );
}
