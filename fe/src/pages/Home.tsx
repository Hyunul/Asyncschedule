// Home.tsx
import BarChartIcon from "@mui/icons-material/BarChart";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid"; // ✅ default import
import { Link } from "react-router-dom";
import { getUserFromToken } from "../utils/jwt";
const featureCards = [
  {
    title: "대시보드",
    subtitle: "미구현 상황입니다.",
    icon: <DashboardIcon fontSize="large" />,
    to: "/dashboard",
  },
  {
    title: "일정 관리",
    subtitle: "내 일정 추가하기",
    icon: <EventIcon fontSize="large" />,
    to: "/schedule",
  },
  {
    title: "통계",
    subtitle: "우리 모임 일정 확인하기",
    icon: <BarChartIcon fontSize="large" />,
    to: "/stats",
  },
];

const Home = () => {
  const user = getUserFromToken();

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      {/* 환영 카드 */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ textAlign: "center", py: 6 }}>
          <Typography variant="h3" gutterBottom>
            환영합니다!
          </Typography>
          <Typography variant="h6" color="text.secondary">
            이곳은 모임 일정 추천 플랫폼, AsyncSchedule입니다!
          </Typography>
        </CardContent>
      </Card>

      {/* 기능 소개 카드 그리드 */}
      {user ? (
        <Grid container spacing={3}>
          {featureCards.map(({ title, subtitle, icon, to }) => (
            <Grid size={{ xs: 12, sm: 4 }} key={title}>
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
      ) : (
        ""
      )}
    </Container>
  );
};

export default Home;
