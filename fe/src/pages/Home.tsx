// Home.tsx
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActionArea,
} from "@mui/material";
import Grid from "@mui/material/Grid";         // ✅ default import
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import BarChartIcon from "@mui/icons-material/BarChart";
import { getUserFromToken } from "../utils/jwt";
import { useState } from "react";
const featureCards = [
  {
    title: "대시보드",
    subtitle: "전체 현황을 한눈에!",
    icon: <DashboardIcon fontSize="large" />,
    to: "/dashboard",
  },
  {
    title: "일정 관리",
    subtitle: "캘린더에서 스케줄 확인",
    icon: <EventIcon fontSize="large" />,
    to: "/schedule",
  },
  {
    title: "통계",
    subtitle: "데이터를 시각화하여 분석",
    icon: <BarChartIcon fontSize="large" />,
    to: "/stats",
  },
];


const Home = () => {
  const [user, setUser] = useState<string | null>(() => getUserFromToken());
  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      {/* 환영 카드 */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ textAlign: "center", py: 6 }}>
          <Typography variant="h3" gutterBottom>
            환영합니다!
          </Typography>
          <Typography variant="h6" color="text.secondary">
            이곳은 MUI 기반 로그인 예제입니다.
          </Typography>
        </CardContent>
      </Card>

      {/* 기능 소개 카드 그리드 */}
      {user ? (
      <Grid container spacing={3}>
        {featureCards.map(({ title, subtitle, icon, to }) => (
          <Grid size={{xs:12, sm:4}} key={title}>
            <Card elevation={3}>
              <CardActionArea
                component={Link}
                to={to}
                sx={{ height: "100%", p: 3, textAlign: "center" }}
              >
                <Box sx={{ mb: 2 }}>{icon}</Box>
                <Typography variant="h6" gutterBottom>
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      ) : ""}
  </Container>
  )
};

export default Home;
