// src/layouts/AppLayout.tsx
import { Box, Container } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AppLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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
      <Container component="main" maxWidth="xl" sx={{ flexGrow: 1, py: 4 }}>
        <Outlet />              {/* 현재 라우트의 화면이 여기 들어감 */}
      </Container>

      <Footer />               {/* column 맨 아래 → “스티키” 푸터 */}
    </Box>
  );
}
